import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import RoutesPage from './pages/Routes';
import ComparePage from './pages/Compare';
import Banking from './pages/Banking';
import Pooling from './pages/Pooling';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/routes" element={<RoutesPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/banking" element={<Banking />} />
        <Route path="/pooling" element={<Pooling />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
      <Footer />
    </ErrorBoundary>
  );
};

export default App;
