import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './index.css';

import App from './App';
import SignUp from './SignUp';
import SignIn from './SignIn';
import About from './About';
import Events from './Events';
import Membership from './Membership';
import Gallery from './Gallery';


import AdvisorDashboard from './AdvisorDashboard';
import ManageEvents from './ManageEvents';
import ManageGallery from './ManageGallery';
import ManageMemberships from './ManageMembership';
import Navbar from './Navbar';

// Navbar does not show here
const HIDE_NAVBAR_ON = [
  '/advisor-dashboard',
  '/president-dashboard',
  '/dashboard',
];

function Layout() {
  const location = useLocation();

  const hideNavbar = HIDE_NAVBAR_ON.some(path =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/"             element={<App />} />
        <Route path="/signup"       element={<SignUp />} />
        <Route path="/signin"       element={<SignIn />} />
        <Route path="/about"        element={<About />} />
        <Route path="/events"       element={<Events />} />
        <Route path="/membership"   element={<Membership />} />
        <Route path="/gallery"      element={<Gallery />} />

        {/* ✅ Advisor Dashboard + sub-routes */}
        <Route path="/advisor-dashboard"             element={<AdvisorDashboard />} />
        <Route path="/advisor-dashboard/events"      element={<ManageEvents />} />
        <Route path="/advisor-dashboard/memberships" element={<ManageMemberships />} />
        <Route path="/advisor-dashboard/gallery"     element={<ManageGallery />} />

        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  </React.StrictMode>
);