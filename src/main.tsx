import { createRoot } from "react-dom/client";
import App from "../app/page";
import "../app/globals.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("页面入口 #root 未找到");
}

createRoot(root).render(<App />);
