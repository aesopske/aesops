import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db, schema } from "@aesops/db";

/**
 * Better Auth Server Instance
 * This file should only be imported in server-side contexts (Node.js/Edge)
 * as it contains the database connection and environment secrets.
 */
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: schema,
    }),
    /**
     * OAuth Providers
     */
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        },
    },
    /**
     * Cross-Subdomain Configuration
     * This ensures the session cookie is available across auth.yourstartup.ke and data.yourstartup.ke
     */
    advanced: {
        crossSubDomainCookies: {
            enabled: true,
            domain: process.env.NEXT_PUBLIC_ROOT_DOMAIN || "yourstartup.ke",
        },
    },
    /**
     * Security: Allowed Redirect Origins
     */
    trustedOrigins: [
        `https://auth.${process.env.NEXT_PUBLIC_ROOT_DOMAIN || "yourstartup.ke"}`,
        `https://*.${process.env.NEXT_PUBLIC_ROOT_DOMAIN || "yourstartup.ke"}`,
    ],
});
