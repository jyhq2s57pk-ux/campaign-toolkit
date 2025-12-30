import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CustomerJourneyPage from './pages/CustomerJourneyPage';
import WaysOfWorkingPage from './pages/WaysOfWorkingPage';
import CalendarPage from './pages/CalendarPage';
import ResourcesPage from './pages/ResourcesPage';
import OmnichannelPage from './pages/OmnichannelPage';
import InsightsPage from './pages/InsightsPage';
import AnnexPage from './pages/AnnexPage';
import AdminPage from './pages/AdminPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/customer-journey" element={<CustomerJourneyPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/ways-of-working" element={<WaysOfWorkingPage />} />
        <Route path="/omnichannel" element={<OmnichannelPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/annex" element={<AnnexPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
