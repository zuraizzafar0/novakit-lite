import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Gallery from "./prototype/Gallery.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* ?gallery opens the component sheet (prototype-only, for Figma import). */}
    {new URLSearchParams(window.location.search).has("gallery") ? <Gallery /> : <App />}
  </React.StrictMode>
);
