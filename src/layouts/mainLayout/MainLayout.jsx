import React from 'react';
import UserHeader from '../../components/userHeader/UserHeader';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <UserHeader />
      <main className="main-layout-content">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;

