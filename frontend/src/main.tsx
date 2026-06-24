import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import "./style.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./app/home/home";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HashRouter basename={"/"}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>,
);
