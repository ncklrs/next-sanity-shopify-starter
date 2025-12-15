/**
 * Shopify Customer Account API - OAuth 2.0 with PKCE Authentication
 *
 * This module handles the complete OAuth flow:
 * 1. Generate PKCE code verifier and challenge
 * 2. Build authorization URL
 * 3. Exchange authorization code for tokens
 * 4. Refresh expired tokens
 * 5. Encrypt/decrypt tokens for secure cookie storage
 */

import { createCipheriv, createDecipheriv, randomBytes, createHash } from "crypto";
import type { TokenResponse, OAuthState, CustomerAccessToken } from "./customer-types";

// ============================================================================
// Environment Configuration
// ============================================================================

const getConfig = () => {
  const shopDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const clientId = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET;
  const cookieSecret = process.env.AUTH_COOKIE_SECRET;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!shopDomain) {
    throw new Error("NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is required");
  }

  if (!clientId) {
    throw new Error("SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID is required");
  }

  // Extract shop name from domain (e.g., "my-store" from "my-store.myshopify.com")
  const shopName = shopDomain.replace(".myshopify.com", "");

  return {
    shopDomain,
    shopName,
    clientId,
    clientSecret,
    cookieSecret,
    appUrl,
    // Customer Account API endpoints
    authorizationEndpoint: `https://shopify.com/${shopName}/auth/oauth/authorize`,
    tokenEndpoint: `https://shopify.com/${shopName}/auth/oauth/token`,
    customerApiEndpoint: `https://shopify.com/${shopName}/account/customer/api/2024-10/graphql`,
    redirectUri: `${appUrl}/api/auth/shopify/callback`,
    // OAuth scopes for Customer Account API
    scopes: [
      "openid",
      "email",
      "customer-account-api:full",
    ].join(" "),
  };
};

// ============================================================================
// PKCE (Proof Key for Code Exchange) Functions
// ============================================================================

/**
 * Generate a cryptographically random code verifier for PKCE
 * RFC 7636 requires 43-128 characters from [A-Z][a-z][0-9]-._~
 */
export function generateCodeVerifier(): string {
  const buffer = randomBytes(32);
  return base64URLEncode(buffer);
}

/**
 * Generate the code challenge from the code verifier using SHA256
 * This is sent to Shopify in the authorization request
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const hash = createHash("sha256").update(verifier).digest();
  return base64URLEncode(hash);
}

/**
 * Generate a random state parameter for CSRF protection
 */
export function generateState(): string {
  return base64URLEncode(randomBytes(16));
}

/**
 * Base64 URL encode (RFC 4648) - removes padding and replaces +/ with -_
 */
function base64URLEncode(buffer: Buffer): string {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

// ============================================================================
// OAuth URL Generation
// ============================================================================

/**
 * Build the Shopify authorization URL for the OAuth flow
 */
export async function getAuthorizationUrl(returnTo?: string): Promise<{
  url: string;
  state: OAuthState;
}> {
  const config = getConfig();
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateState();

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: config.scopes,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  // Add nonce for OpenID Connect
  const nonce = generateState();
  params.set("nonce", nonce);

  return {
    url: `${config.authorizationEndpoint}?${params.toString()}`,
    state: {
      codeVerifier,
      state,
      returnTo,
    },
  };
}

// ============================================================================
// Token Exchange & Refresh
// ============================================================================

/**
 * Exchange the authorization code for access and refresh tokens
 */
export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string
): Promise<CustomerAccessToken> {
  const config = getConfig();

  const params = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    code,
    code_verifier: codeVerifier,
  });

  // If we have a client secret, use it (for confidential clients)
  if (config.clientSecret) {
    params.set("client_secret", config.clientSecret);
  }

  const response = await fetch(config.tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Token exchange failed:", errorData);
    throw new Error(
      `Token exchange failed: ${errorData.error_description || errorData.error || response.statusText}`
    );
  }

  const tokenData: TokenResponse = await response.json();

  return {
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
    expiresAt: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
    idToken: tokenData.id_token,
  };
}

/**
 * Refresh an expired access token using the refresh token
 */
export async function refreshAccessToken(
  refreshToken: string
): Promise<CustomerAccessToken> {
  const config = getConfig();

  const params = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: config.clientId,
    refresh_token: refreshToken,
  });

  if (config.clientSecret) {
    params.set("client_secret", config.clientSecret);
  }

  const response = await fetch(config.tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Token refresh failed:", errorData);
    throw new Error(
      `Token refresh failed: ${errorData.error_description || errorData.error || response.statusText}`
    );
  }

  const tokenData: TokenResponse = await response.json();

  return {
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
    expiresAt: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
    idToken: tokenData.id_token,
  };
}

/**
 * Check if the access token is expired or about to expire
 * Returns true if token expires within the next 5 minutes
 */
export function isTokenExpired(expiresAt: string): boolean {
  const expirationTime = new Date(expiresAt).getTime();
  const now = Date.now();
  const bufferMs = 5 * 60 * 1000; // 5 minute buffer
  return now >= expirationTime - bufferMs;
}

// ============================================================================
// Token Encryption for Secure Cookie Storage
// ============================================================================

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

/**
 * Encrypt sensitive token data for storage in cookies
 */
export function encryptToken(data: string): string {
  const config = getConfig();

  if (!config.cookieSecret) {
    throw new Error("AUTH_COOKIE_SECRET is required for token encryption");
  }

  // Derive a 32-byte key from the secret
  const key = createHash("sha256").update(config.cookieSecret).digest();

  // Generate a random IV
  const iv = randomBytes(IV_LENGTH);

  // Create cipher and encrypt
  const cipher = createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(data, "utf8", "base64");
  encrypted += cipher.final("base64");

  // Get the auth tag
  const authTag = cipher.getAuthTag();

  // Combine IV + authTag + encrypted data
  const combined = Buffer.concat([iv, authTag, Buffer.from(encrypted, "base64")]);

  return combined.toString("base64");
}

/**
 * Decrypt token data from cookies
 */
export function decryptToken(encryptedData: string): string {
  const config = getConfig();

  if (!config.cookieSecret) {
    throw new Error("AUTH_COOKIE_SECRET is required for token decryption");
  }

  // Derive the same key
  const key = createHash("sha256").update(config.cookieSecret).digest();

  // Decode the combined data
  const combined = Buffer.from(encryptedData, "base64");

  // Extract IV, auth tag, and encrypted content
  const iv = combined.subarray(0, IV_LENGTH);
  const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const encrypted = combined.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

  // Create decipher and decrypt
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted.toString("base64"), "base64", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

// ============================================================================
// Cookie Configuration
// ============================================================================

export const AUTH_COOKIE_NAME = "shopify_customer_auth";
export const STATE_COOKIE_NAME = "shopify_oauth_state";

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30, // 30 days
};

export const stateCookieOptions = {
  ...cookieOptions,
  maxAge: 60 * 10, // 10 minutes for OAuth state
};

// ============================================================================
// Customer API Request Helper
// ============================================================================

/**
 * Make an authenticated request to the Customer Account API
 */
export async function customerApiRequest<T>(
  accessToken: string,
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  const config = getConfig();

  const response = await fetch(config.customerApiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Customer API request failed:", response.status, errorText);
    throw new Error(`Customer API request failed: ${response.statusText}`);
  }

  const json = await response.json();

  if (json.errors && json.errors.length > 0) {
    console.error("Customer API GraphQL errors:", json.errors);
    throw new Error(json.errors[0].message);
  }

  return json.data;
}

// ============================================================================
// Export Configuration Helper
// ============================================================================

export { getConfig };
