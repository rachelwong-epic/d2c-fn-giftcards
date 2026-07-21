import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@epic-typeface/inter";
import "@epic-typeface/recursive";
import EDSProvider from "@eds/react/EDSProvider";
import { lowDensityThemeClass } from "@eds/react";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className={lowDensityThemeClass}>
      <EDSProvider themeClass={lowDensityThemeClass}>
        <App />
      </EDSProvider>
    </div>
  </StrictMode>,
);
