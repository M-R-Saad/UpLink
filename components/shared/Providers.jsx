"use client";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useState } from "react";
import { ThemeProvider } from "./ThemeProvider";

export default function Providers({ children }) {
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: { staleTime: 60 * 1000, retry: 1 },
      },
    })
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "var(--bg-card)",
                color: "var(--text)",
                border: "1px solid var(--border)",
                fontFamily: "Outfit, sans-serif",
                fontSize: "14px",
              },
            }}
          />
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
