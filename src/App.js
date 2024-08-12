import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import OneColorPage from './pages/OneColorPage';
import TwoColorsPage from './pages/TwoColorsPage';
import ThreeColorsPage from './pages/ThreeColorsPage';
import OneToneWebsitePage from './pages/OneToneWebsitePage';
import TwoToneWebsitePage from './pages/TwoToneWebsitePage'; // Import the new TwoToneWebsitePage
import AboutPage from './pages/About';
import Sidebar from './components/Sidebar';
import { SidebarProvider } from './contexts/SidebarContext';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const App = () => {
  return (
    <SidebarProvider>
      <Router>
        <Main />
      </Router>
    </SidebarProvider>
  );
};

const Main = () => {
  const location = useLocation();
  const showSidebar = location.pathname !== '/' && location.pathname !== '/landing';

  return (
    <div className="flex h-screen">
      {showSidebar && <Sidebar setSelectedOption={() => {}} />}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/one-color" element={<OneColorPage />} />
          <Route path="/two-colors" element={<TwoColorsPage />} />
          <Route path="/three-colors" element={<ThreeColorsPage />} />
          <Route path="/one-tone-website" element={<OneToneWebsitePage />} />
          <Route path="/two-tones" element={<TwoToneWebsitePage />} /> {/* Add the new route */}
          <Route path="/about" element={<AboutPage />} /> {/* Add the About route */}
        </Routes>
      </div>
    </div>
  );
};

export default App;
