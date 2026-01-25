/**
 * AI Chat API Route
 * Handles streaming chat with tool calling for commerce operations
 * Updated for AI SDK v6
 */

import { streamText, stepCountIs } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { commerceTools } from "@/lib/ai/tools";
import { SYSTEM_PROMPT, getContextualPrompt, getCustomerContextPrompt } from "@/lib/ai/prompts";

// Configure runtime
export const runtime = "nodejs";
export const maxDuration = 30;

// Rate limiting with automatic cleanup
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
let lastCleanup = Date.now();

// Input validation limits
const MAX_MESSAGES = 100;
const MAX_MESSAGE_LENGTH = 10000;

function cleanupRateLimitMap(): void {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetAt) {
      rateLimitMap.delete(ip);
    }
  }
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();

  // Periodic cleanup to prevent memory leak
  if (now - lastCleanup > CLEANUP_INTERVAL) {
    cleanupRateLimitMap();
    lastCleanup = now;
  }

  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

// Type for incoming messages
interface ChatMessage {
  role: "user" | "assistant" | "system";
  content?: string;
  parts?: Array<{ type: string; text?: string }>;
}

export async function POST(request: Request) {
  try {
    // Get client IP for rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({
          error: "Too many requests. Please wait a moment.",
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Parse request body
    const body = await request.json();
    const { messages, context, customerContext } = body as {
      messages: ChatMessage[];
      context?: {
        type: string;
        product?: { title: string; handle: string };
        collection?: { title: string; handle: string };
        searchQuery?: string;
      };
      customerContext?: {
        isAuthenticated: boolean;
        email?: string;
        firstName?: string;
        recentlyViewed?: string[];
        wishlistItems?: string[];
        orderHistory?: Array<{ id: string; totalPrice: string; itemCount: number }>;
      };
    };

    // Validate messages exist
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Messages are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate message count to prevent abuse
    if (messages.length > MAX_MESSAGES) {
      return new Response(
        JSON.stringify({ error: "Too many messages in request" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate individual message content length
    for (const msg of messages) {
      const content = msg.content || msg.parts?.map(p => p.text || "").join("") || "";
      if (content.length > MAX_MESSAGE_LENGTH) {
        return new Response(
          JSON.stringify({ error: "Message content too long" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // Transform UIMessage parts format to simple content format for the model
    const transformedMessages = messages.map((msg) => {
      // If message has parts array, extract text content
      if (msg.parts && Array.isArray(msg.parts)) {
        const textContent = msg.parts
          .filter((part): part is { type: "text"; text: string } => part.type === "text" && !!part.text)
          .map((part) => part.text)
          .join("");
        return {
          role: msg.role,
          content: textContent,
        };
      }
      return {
        role: msg.role,
        content: msg.content || "",
      };
    });

    // Build system prompt with page and customer context
    const systemPrompt =
      SYSTEM_PROMPT +
      (context ? getContextualPrompt(context) : "") +
      getCustomerContextPrompt(customerContext);

    // Stream the response
    const result = streamText({
      model: anthropic("claude-sonnet-4-20250514"),
      system: systemPrompt,
      messages: transformedMessages,
      tools: commerceTools,
      stopWhen: stepCountIs(5), // AI SDK v6: replaces maxSteps
      temperature: 0.7,
    });

    // Return streaming response compatible with useChat
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("AI Chat error:", error);

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return new Response(
          JSON.stringify({
            error: "AI service is not configured. Please contact support.",
          }),
          {
            status: 503,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    return new Response(
      JSON.stringify({
        error: "Something went wrong. Please try again.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
