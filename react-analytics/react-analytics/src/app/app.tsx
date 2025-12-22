import { Routes, Route, Navigate } from "react-router-dom";
import SimpleAnalytics from "./simple-analytics";
import TestComponent from "./test-component";
import "./analytics-dashboard.css";

export function App() {
  // Debug logging
  console.log("🔍 Router Debug - Current URL:", window.location.href);
  console.log("🔍 Router Debug - Pathname:", window.location.pathname);
  console.log("🔍 Router Debug - In iframe?:", window.self !== window.top);

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Navigate to="/analytics" replace />} />
        <Route path="/analytics" element={<SimpleAnalytics />} />
        {/* Removemos el catch-all para evitar bucles en iframe */}
      </Routes>
    </div>
  );
}

export default App;
