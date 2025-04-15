import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './dashboard/Header';
import Footer from './dashboard/Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className={`min-h-screen flex flex-col ${isHomePage ? 'h-screen' : ''}`}>
      <Header />
      <main 
        className={`w-full max-w-[1100px] mx-auto px-4 
                   ${isHomePage ? 'flex-1 flex flex-col items-center justify-center py-0' : 'py-8'}`}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;