import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import localStorageService from "./services/localStorageService";

// Initialize localStorage with sample data if empty
localStorageService.initializeData();

createRoot(document.getElementById("root")!).render(<App />);
