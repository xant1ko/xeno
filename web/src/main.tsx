import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ConfigProvider, theme as antdTheme } from "antd";
import { theme } from "./theme.ts";
import { applyColorScheme } from "./theme.colors.ts";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./config/querryClient.ts";
import ruRU from "antd/locale/ru_RU";

applyColorScheme();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <ConfigProvider
      theme={{
        ...theme,
        algorithm: antdTheme.darkAlgorithm,
        }}
        locale={ruRU}
    >
      <App />
    </ConfigProvider>
    </QueryClientProvider>
  </StrictMode>,
);
