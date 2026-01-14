import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CustomerJourneyPage from './pages/CustomerJourneyPage';
import WaysOfWorkingPage from './pages/WaysOfWorkingPage';
import CalendarPage from './pages/CalendarPage';
import ResourcesPage from './pages/ResourcesPage';
import ResourceDetailPage from './pages/ResourceDetailPage';
import OmnichannelPage from './pages/OmnichannelPage';
import InsightsPage from './pages/InsightsPage';
import AnnexPage from './pages/AnnexPage';
import AdminPage from './pages/AdminPage';
import DesignSystemPage from './pages/DesignSystemPage';
import './App.css';

import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/customer-journey" element={<CustomerJourneyPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/resources/:id" element={<ResourceDetailPage />} />
        <Route path="/ways-of-working" element={<WaysOfWorkingPage />} />
        <Route path="/omnichannel" element={<OmnichannelPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/annex" element={<AnnexPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/design-system" element={<DesignSystemPage />} />
        {/* Redirect legacy routes to new Design System */}
        <Route path="/style-gallery" element={<DesignSystemPage />} />
        <Route path="/components" element={<DesignSystemPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
