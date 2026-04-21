import { createAuthClient } from "better-auth/client";

/**
 * Better Auth Client Instance (Frontend Only)
 *
 * This file is isolated from the server-side logic to prevent
 * Node.js specific modules (like 'net', 'tls', or 'crypto' from the database adapter)
 * from being bundled into the client-side code.
 */
export const authClient = createAuthClient({
    /**
     * The base URL of the Auth Gateway (auth.yourstartup.ke).
     * All client-side requests (login, signup, etc.) are directed here.
     */
    baseURL: process.env.NEXT_PUBLIC_AUTH_URL || `https://auth.yourstartup.ke`,
});
