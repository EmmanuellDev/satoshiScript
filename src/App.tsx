import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ConverterPage from './pages/ConverterPage';
import TutorPage from './pages/TutorPage';
import { WalletProvider } from './context/WalletContext';

function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <Navbar />
          <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/converter" element={<ConverterPage />} />
              <Route path="/tutor" element={<TutorPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </WalletProvider>
  );
}

export default App;