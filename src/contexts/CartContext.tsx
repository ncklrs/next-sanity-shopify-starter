"use client";

/**
 * Cart Context - Global shopping cart state management
 * Uses React Context + useReducer with localStorage persistence
 * Integrated with Shopify Storefront API
 */

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  createCart,
  addToCart as shopifyAddToCart,
  updateCartItem as shopifyUpdateCartItem,
  removeFromCart as shopifyRemoveFromCart,
  getCart,
  type Cart,
  type CartLineInput,
  type CartLineUpdateInput,
} from "@/lib/shopify";

// ============================================================================
// Types
// ============================================================================

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
}

type CartAction =
  | { type: "SET_CART"; payload: Cart | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "CLEAR_CART" };

interface CartContextValue extends CartState {
  // Cart operations
  addItem: (merchandiseId: string, quantity?: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  // Computed values
  totalQuantity: number;
  checkoutUrl: string | null;
}

// ============================================================================
// Constants
// ============================================================================

const CART_ID_KEY = "shopify_cart_id";

// ============================================================================
// Reducer
// ============================================================================

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_CART":
      return {
        ...state,
        cart: action.payload,
        isLoading: false,
        error: null,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case "CLEAR_CART":
      return {
        cart: null,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
}

// ============================================================================
// Context
// ============================================================================

const CartContext = createContext<CartContextValue | undefined>(undefined);

// ============================================================================
// Provider Component
// ============================================================================

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, {
    cart: null,
    isLoading: true,
    error: null,
  });

  // ============================================================================
  // Local Storage Helpers
  // ============================================================================

  const getStoredCartId = useCallback((): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(CART_ID_KEY);
  }, []);

  const setStoredCartId = useCallback((cartId: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(CART_ID_KEY, cartId);
  }, []);

  const removeStoredCartId = useCallback(() => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(CART_ID_KEY);
  }, []);

  // ============================================================================
  // Cart Initialization
  // ============================================================================

  useEffect(() => {
    async function initializeCart() {
      const storedCartId = getStoredCartId();

      if (!storedCartId) {
        dispatch({ type: "SET_LOADING", payload: false });
        return;
      }

      try {
        const cart = await getCart(storedCartId);

        if (cart) {
          dispatch({ type: "SET_CART", payload: cart });
        } else {
          // Cart not found (expired or deleted)
          removeStoredCartId();
          dispatch({ type: "SET_LOADING", payload: false });
        }
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        removeStoredCartId();
        dispatch({
          type: "SET_ERROR",
          payload:
            error instanceof Error ? error.message : "Failed to fetch cart",
        });
      }
    }

    initializeCart();
  }, [getStoredCartId, removeStoredCartId]);

  // ============================================================================
  // Cart Operations
  // ============================================================================

  const ensureCart = useCallback(async (): Promise<string> => {
    if (state.cart?.id) {
      return state.cart.id;
    }

    const storedCartId = getStoredCartId();
    if (storedCartId) {
      return storedCartId;
    }

    // Create a new cart
    const newCart = await createCart();
    setStoredCartId(newCart.id);
    dispatch({ type: "SET_CART", payload: newCart });
    return newCart.id;
  }, [state.cart?.id, getStoredCartId, setStoredCartId]);

  const addItem = useCallback(
    async (merchandiseId: string, quantity: number = 1) => {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      try {
        const cartId = await ensureCart();

        const lines: CartLineInput[] = [
          {
            merchandiseId,
            quantity,
          },
        ];

        const updatedCart = await shopifyAddToCart(cartId, lines);
        dispatch({ type: "SET_CART", payload: updatedCart });
      } catch (error) {
        console.error("Failed to add item to cart:", error);
        dispatch({
          type: "SET_ERROR",
          payload:
            error instanceof Error ? error.message : "Failed to add item",
        });
        throw error;
      }
    },
    [ensureCart]
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!state.cart?.id) {
        console.error("No cart found");
        return;
      }

      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      try {
        const updatedCart = await shopifyRemoveFromCart(state.cart.id, [
          lineId,
        ]);
        dispatch({ type: "SET_CART", payload: updatedCart });
      } catch (error) {
        console.error("Failed to remove item from cart:", error);
        dispatch({
          type: "SET_ERROR",
          payload:
            error instanceof Error ? error.message : "Failed to remove item",
        });
        throw error;
      }
    },
    [state.cart?.id]
  );

  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!state.cart?.id) {
        console.error("No cart found");
        return;
      }

      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      try {
        const lines: CartLineUpdateInput[] = [
          {
            id: lineId,
            quantity,
          },
        ];

        const updatedCart = await shopifyUpdateCartItem(state.cart.id, lines);
        dispatch({ type: "SET_CART", payload: updatedCart });
      } catch (error) {
        console.error("Failed to update cart item:", error);
        dispatch({
          type: "SET_ERROR",
          payload:
            error instanceof Error
              ? error.message
              : "Failed to update quantity",
        });
        throw error;
      }
    },
    [state.cart?.id]
  );

  const clearCart = useCallback(() => {
    removeStoredCartId();
    dispatch({ type: "CLEAR_CART" });
  }, [removeStoredCartId]);

  // ============================================================================
  // Computed Values
  // ============================================================================

  const totalQuantity = state.cart?.totalQuantity ?? 0;
  const checkoutUrl = state.cart?.checkoutUrl ?? null;

  // ============================================================================
  // Context Value
  // ============================================================================

  const value: CartContextValue = {
    cart: state.cart,
    isLoading: state.isLoading,
    error: state.error,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalQuantity,
    checkoutUrl,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Use cart context
 * Must be used within a CartProvider
 */
export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
