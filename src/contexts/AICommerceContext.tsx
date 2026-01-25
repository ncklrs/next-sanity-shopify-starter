"use client";

/**
 * AI Commerce Context
 * Global state management for the agentic commerce layer
 * Integrates with useChat from Vercel AI SDK v6
 * Features conversation history persistence via localStorage
 */

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from "react";
import { useChat, type UIMessage } from "@ai-sdk/react";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import type {
  AICommerceAction,
  PageContext,
  CustomerContext,
} from "@/lib/ai/types";
import { getWelcomeMessage } from "@/lib/ai/prompts";

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEY = "ai-commerce-chat-history";
const MAX_STORED_MESSAGES = 50; // Limit stored messages to prevent localStorage bloat

// ============================================================================
// State Types (local to context, not using AICommerceState from types)
// ============================================================================

interface LocalState {
  isOpen: boolean;
  isStreaming: boolean;
  pageContext: PageContext | null;
  customerContext: CustomerContext | null;
}

const initialState: LocalState = {
  isOpen: false,
  isStreaming: false,
  pageContext: null,
  customerContext: null,
};

// ============================================================================
// Reducer
// ============================================================================

function aiCommerceReducer(
  state: LocalState,
  action: AICommerceAction
): LocalState {
  switch (action.type) {
    case "OPEN_SHEET":
      return { ...state, isOpen: true };
    case "CLOSE_SHEET":
      return { ...state, isOpen: false };
    case "SET_STREAMING":
      return { ...state, isStreaming: action.payload };
    case "SET_PAGE_CONTEXT":
      return { ...state, pageContext: action.payload };
    case "SET_CUSTOMER_CONTEXT":
      return { ...state, customerContext: action.payload };
    case "CLEAR_MESSAGES":
      return state; // Messages are managed by useChat
    default:
      return state;
  }
}

// ============================================================================
// Helper to extract text content from UIMessage parts
// ============================================================================

function getMessageContent(message: UIMessage): string {
  if (!message.parts) return "";
  return message.parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join("");
}

// ============================================================================
// Persistence Helpers
// ============================================================================

/**
 * Load messages from localStorage
 * Returns empty array if no messages or on error
 */
function loadMessagesFromStorage(): UIMessage[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    // Validate basic message structure
    return parsed.filter(
      (msg): msg is UIMessage =>
        msg &&
        typeof msg.id === "string" &&
        typeof msg.role === "string" &&
        Array.isArray(msg.parts)
    );
  } catch (error) {
    console.warn("Failed to load chat history:", error);
    return [];
  }
}

/**
 * Save messages to localStorage
 * Only saves text parts to reduce storage size
 */
function saveMessagesToStorage(messages: UIMessage[]): void {
  if (typeof window === "undefined") return;

  try {
    // Limit the number of messages stored
    const messagesToStore = messages.slice(-MAX_STORED_MESSAGES);

    // Simplify messages for storage - only keep text parts
    const simplified = messagesToStore.map((msg) => ({
      id: msg.id,
      role: msg.role,
      parts: msg.parts?.filter((part) => part.type === "text") || [],
    }));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(simplified));
  } catch (error) {
    console.warn("Failed to save chat history:", error);
  }
}

/**
 * Clear messages from localStorage
 */
function clearMessagesFromStorage(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to clear chat history:", error);
  }
}

// ============================================================================
// Context Value Type
// ============================================================================

interface AICommerceContextValue {
  // State
  isOpen: boolean;
  isStreaming: boolean;
  pageContext: PageContext | null;
  customerContext: CustomerContext | null;

  // Sheet controls
  openSheet: () => void;
  closeSheet: () => void;
  toggleSheet: () => void;

  // Chat state from useChat
  messages: UIMessage[];
  input: string;
  setInput: (input: string) => void;
  handleSubmit: (e?: React.FormEvent) => void;
  isLoading: boolean;
  error?: Error;
  stop: () => void;

  // Context setters
  setPageContext: (context: PageContext | null) => void;
  setCustomerContext: (context: CustomerContext | null) => void;

  // Actions
  clearChat: () => void;
  sendUserMessage: (message: string) => void;

  // Helper
  getMessageContent: (message: UIMessage) => string;
}

// ============================================================================
// Context
// ============================================================================

const AICommerceContext = createContext<AICommerceContextValue | undefined>(
  undefined
);

// ============================================================================
// Provider
// ============================================================================

interface AICommerceProviderProps {
  children: ReactNode;
}

export function AICommerceProvider({ children }: AICommerceProviderProps) {
  const [state, dispatch] = useReducer(aiCommerceReducer, initialState);
  const { addItem: addToCart, checkoutUrl } = useCart();
  const { customer, isAuthenticated } = useAuth();

  // Local input state (AI SDK v6 doesn't manage input state)
  const [input, setInput] = useState("");

  // Track if we've loaded initial messages from storage
  const hasLoadedFromStorage = useRef(false);
  const [initialMessages] = useState<UIMessage[]>(() => loadMessagesFromStorage());

  // Sync customer context from AuthContext
  useEffect(() => {
    if (isAuthenticated && customer) {
      const customerContext: CustomerContext = {
        isAuthenticated: true,
        email: customer.email,
        firstName: customer.firstName || undefined,
        lastName: customer.lastName || undefined,
        recentlyViewed: customer.recentlyViewed || [],
        wishlistItems: customer.wishlist || [],
        orderHistory: customer.totalOrders > 0
          ? [{
              id: "summary",
              createdAt: customer.createdAt,
              totalPrice: `$${(customer.totalSpent / 100).toFixed(2)}`,
              itemCount: customer.totalOrders,
            }]
          : [],
        preferences: customer.preferences
          ? {
              preferredCategories: [], // Could be derived from order history
            }
          : undefined,
      };
      dispatch({ type: "SET_CUSTOMER_CONTEXT", payload: customerContext });
    } else {
      dispatch({ type: "SET_CUSTOMER_CONTEXT", payload: null });
    }
  }, [customer, isAuthenticated]);

  // Handle tool results that require client-side actions
  const handleToolResult = useCallback(
    async (toolName: string, result: unknown) => {
      const actionResult = result as {
        action?: string;
        variantId?: string;
        quantity?: number;
        productTitle?: string;
        variantTitle?: string;
      };

      switch (actionResult.action) {
        case "ADD_TO_CART":
          if (!actionResult.variantId) {
            break;
          }
          try {
            await addToCart(actionResult.variantId, actionResult.quantity || 1);
          } catch (err) {
            console.error("Failed to add to cart:", err);
          }
          break;

        case "GET_CART":
          // Cart data is already available via useCart
          break;

        case "GENERATE_CHECKOUT":
          // Checkout URL is handled by the AI response
          break;
      }
    },
    [addToCart, checkoutUrl]
  );

  // Initialize useChat with the AI route
  const {
    messages,
    status,
    error,
    stop,
    setMessages,
    sendMessage: chatSendMessage,
  } = useChat({
    id: "commerce-chat",
    onFinish: ({ message }) => {
      dispatch({ type: "SET_STREAMING", payload: false });

      // Handle tool call results from parts
      if (message.parts) {
        for (const part of message.parts) {
          // AI SDK v6: tool parts have type starting with "tool-" and contain tool info directly
          if (part.type.startsWith("tool-") && "state" in part && "output" in part) {
            const toolPart = part as {
              type: string;
              toolCallId: string;
              state: string;
              output?: unknown;
            };
            // Extract tool name from the type (e.g., "tool-searchProducts")
            const toolName = toolPart.type.replace("tool-", "");
            if (toolPart.state === "output" && toolPart.output) {
              handleToolResult(toolName, toolPart.output);
            }
          }
        }
      }
    },
    onError: (err: Error) => {
      console.error("Chat error:", err);
      dispatch({ type: "SET_STREAMING", payload: false });
      // Error is displayed in the chat UI via the error state
    },
  });

  // Derive isLoading from status
  const isLoading = status === "submitted" || status === "streaming";

  // Load persisted messages on mount
  useEffect(() => {
    if (!hasLoadedFromStorage.current && initialMessages.length > 0) {
      hasLoadedFromStorage.current = true;
      setMessages(initialMessages);
    }
  }, [initialMessages, setMessages]);

  // Persist messages to localStorage when they change
  useEffect(() => {
    // Skip if we haven't loaded from storage yet
    if (!hasLoadedFromStorage.current) {
      hasLoadedFromStorage.current = true;
      return;
    }

    // Only save if we have messages (don't save empty array on initial load)
    if (messages.length > 0) {
      saveMessagesToStorage(messages);
    }
  }, [messages]);

  // Sheet controls
  const openSheet = useCallback(() => {
    dispatch({ type: "OPEN_SHEET" });

    // Add welcome message if no messages yet
    if (messages.length === 0) {
      const welcomeText = getWelcomeMessage(
        state.pageContext
          ? {
              type: state.pageContext.type,
              product: state.pageContext.product
                ? { title: state.pageContext.product.title }
                : undefined,
              collection: state.pageContext.collection
                ? { title: state.pageContext.collection.title }
                : undefined,
            }
          : undefined
      );

      setMessages([
        {
          id: "welcome",
          role: "assistant",
          parts: [{ type: "text", text: welcomeText }],
        } as UIMessage,
      ]);
    }
  }, [messages.length, state.pageContext, setMessages]);

  const closeSheet = useCallback(() => {
    dispatch({ type: "CLOSE_SHEET" });
  }, []);

  const toggleSheet = useCallback(() => {
    if (state.isOpen) {
      closeSheet();
    } else {
      openSheet();
    }
  }, [state.isOpen, openSheet, closeSheet]);

  // Context setters
  const setPageContext = useCallback((context: PageContext | null) => {
    dispatch({ type: "SET_PAGE_CONTEXT", payload: context });
  }, []);

  const setCustomerContext = useCallback((context: CustomerContext | null) => {
    dispatch({ type: "SET_CUSTOMER_CONTEXT", payload: context });
  }, []);

  // Actions
  const clearChat = useCallback(() => {
    setMessages([]);
    clearMessagesFromStorage();
  }, [setMessages]);

  const sendUserMessage = useCallback(
    async (message: string) => {
      dispatch({ type: "SET_STREAMING", payload: true });

      // Send message with page and customer context in the body
      await chatSendMessage(
        {
          id: Date.now().toString(),
          role: "user",
          parts: [{ type: "text", text: message }],
        } as UIMessage,
        {
          body: {
            context: state.pageContext,
            customerContext: state.customerContext,
          },
        }
      );
    },
    [chatSendMessage, state.pageContext, state.customerContext]
  );

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!input.trim()) return;

      const message = input;
      setInput(""); // Clear input immediately

      await sendUserMessage(message);
    },
    [input, sendUserMessage]
  );

  // Handle escape key to close sheet
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && state.isOpen) {
        closeSheet();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [state.isOpen, closeSheet]);

  // ============================================================================
  // Context Value
  // ============================================================================

  const value: AICommerceContextValue = {
    isOpen: state.isOpen,
    isStreaming: state.isStreaming,
    pageContext: state.pageContext,
    customerContext: state.customerContext,
    messages,
    input,
    setInput,
    handleSubmit,
    isLoading,
    error,
    stop,
    openSheet,
    closeSheet,
    toggleSheet,
    setPageContext,
    setCustomerContext,
    clearChat,
    sendUserMessage,
    getMessageContent,
  };

  return (
    <AICommerceContext.Provider value={value}>
      {children}
    </AICommerceContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useAICommerce(): AICommerceContextValue {
  const context = useContext(AICommerceContext);

  if (context === undefined) {
    throw new Error("useAICommerce must be used within an AICommerceProvider");
  }

  return context;
}
