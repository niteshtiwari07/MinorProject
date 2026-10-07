"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
const isConvexConfigured = Boolean(process.env.NEXT_PUBLIC_CONVEX_URL);
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://happy-animal-123.convex.cloud";
const convex = new ConvexReactClient(convexUrl);

function useSafeAuth() {
  const auth = useAuth();
  return {
    ...auth,
    getToken: async (options) => {
      if (process.env.NEXT_PUBLIC_CLERK_CONVEX_JWT === "true") {
        try {
          return await auth.getToken(options);
        } catch (err) {
          return null;
        }
      }
      return null;
    },
  };
}

export function ConvexClientProvider({ children }) {
  if (isConvexConfigured) {
    return (
      <ConvexProviderWithClerk client={convex} useAuth={useSafeAuth}>
        {children}
      </ConvexProviderWithClerk>
    );
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
