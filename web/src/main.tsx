import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ConfigProvider, theme as antdTheme } from "antd";
import { theme } from "./theme.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        ...theme,
        algorithm: antdTheme.darkAlgorithm,
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>,
);
