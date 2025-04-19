import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import { MiniAppProvider } from "./components/providers/MiniAppProvider.tsx";
import { ThemeProvider } from "./components/providers/theme-provider.tsx";
import queryClient from "./lib/utils.ts";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <MiniAppProvider>
                <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                    <App />
                </ThemeProvider>
            </MiniAppProvider>
        </QueryClientProvider>
    </StrictMode>,
);
