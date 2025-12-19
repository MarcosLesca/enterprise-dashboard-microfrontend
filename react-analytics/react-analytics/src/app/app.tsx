import { Routes, Route, Navigate } from 'react-router-dom';
import SimpleAnalytics from './simple-analytics';
import './simple-chart.css';

export function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Navigate to="/analytics" replace />} />
        <Route path="/analytics" element={<SimpleAnalytics />} />
        <Route path="*" element={<Navigate to="/analytics" replace />} />
      </Routes>
    </div>
  );
}

export default App;
