import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { CameraAnimator } from "./components/cameraAnimator.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CameraAnimator />
    <App />
  </StrictMode>,
);
