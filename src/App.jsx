import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TouchpointsPage from './pages/TouchpointsPage';
import AdminPage from './pages/AdminPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TouchpointsPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
