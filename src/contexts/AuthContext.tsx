"use client";

/**
 * Auth Context - Customer authentication state management
 * Handles OAuth session with Shopify Customer Account API
 * Customer data is mirrored to Sanity for fast reads
 */

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { SanityCustomer } from "@/lib/shopify/customer-types";

// ============================================================================
// Types
// ============================================================================

interface AuthState {
  customer: SanityCustomer | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

type AuthAction =
  | { type: "SET_CUSTOMER"; payload: SanityCustomer | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_AUTHENTICATED"; payload: boolean }
  | { type: "LOGOUT" };

interface AuthContextValue extends AuthState {
  // Auth operations
  login: (returnTo?: string) => void;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  // Profile operations
  updateCustomer: (data: Partial<SanityCustomer>) => void;
}

// ============================================================================
// Reducer
// ============================================================================

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_CUSTOMER":
      return {
        ...state,
        customer: action.payload,
        isAuthenticated: action.payload !== null,
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
    case "SET_AUTHENTICATED":
      return {
        ...state,
        isAuthenticated: action.payload,
      };
    case "LOGOUT":
      return {
        customer: null,
        isAuthenticated: false,
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

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ============================================================================
// Provider Component
// ============================================================================

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, {
    customer: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // ============================================================================
  // Session Check
  // ============================================================================

  const checkSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/shopify/session", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Session check failed");
      }

      const data = await response.json();

      if (data.isAuthenticated && data.customer) {
        dispatch({ type: "SET_CUSTOMER", payload: data.customer });

        // Proactively refresh token if needed
        if (data.needsRefresh) {
          refreshToken();
        }
      } else {
        dispatch({ type: "SET_CUSTOMER", payload: null });
      }
    } catch (error) {
      console.error("Session check failed:", error);
      dispatch({ type: "SET_CUSTOMER", payload: null });
    }
  }, []);

  // Initialize session on mount
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // ============================================================================
  // Token Refresh
  // ============================================================================

  const refreshToken = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/shopify/refresh", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.requiresLogin) {
          // Token refresh failed - user needs to log in again
          dispatch({ type: "LOGOUT" });
        }
        throw new Error(data.error || "Token refresh failed");
      }

      return data.refreshed;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  }, []);

  // ============================================================================
  // Auth Operations
  // ============================================================================

  const login = useCallback((returnTo?: string) => {
    // Build login URL with optional returnTo parameter
    const loginUrl = returnTo
      ? `/api/auth/shopify/login?returnTo=${encodeURIComponent(returnTo)}`
      : "/api/auth/shopify/login";

    // Redirect to OAuth flow
    window.location.href = loginUrl;
  }, []);

  const logout = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      await fetch("/api/auth/shopify/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ redirectTo: "/" }),
      });

      dispatch({ type: "LOGOUT" });
    } catch (error) {
      console.error("Logout failed:", error);
      // Still clear local state even if API call fails
      dispatch({ type: "LOGOUT" });
    }
  }, []);

  const refreshSession = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    await checkSession();
  }, [checkSession]);

  // ============================================================================
  // Profile Operations
  // ============================================================================

  const updateCustomer = useCallback((data: Partial<SanityCustomer>) => {
    dispatch({
      type: "SET_CUSTOMER",
      payload: state.customer ? { ...state.customer, ...data } : null,
    });
  }, [state.customer]);

  // ============================================================================
  // Context Value
  // ============================================================================

  const value: AuthContextValue = {
    customer: state.customer,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    error: state.error,
    login,
    logout,
    refreshSession,
    updateCustomer,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Use auth context
 * Must be used within an AuthProvider
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
