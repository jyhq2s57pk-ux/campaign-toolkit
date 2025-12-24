import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TouchpointsPage from './pages/TouchpointsPage';
import WaysOfWorkingPage from './pages/WaysOfWorkingPage';
import Calendar2026Page from './pages/Calendar2026Page';
import ResourcesPage from './pages/ResourcesPage';
import AdminPage from './pages/AdminPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/touchpoints" element={<TouchpointsPage />} />
        <Route path="/ways-of-working" element={<WaysOfWorkingPage />} />
        <Route path="/calendar" element={<Calendar2026Page />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
