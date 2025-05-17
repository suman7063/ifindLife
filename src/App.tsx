
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './AppRoutes';
import { Toaster } from 'sonner';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <AppRoutes />
      <Footer />
      <Toaster position="top-right" />
    </Router>
  );
};

export default App;
