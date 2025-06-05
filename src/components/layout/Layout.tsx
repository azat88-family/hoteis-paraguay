import React from 'react';
import { Outlet, useLocation } from 'react-router-dom'; // Added useLocation
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface LayoutProps {
  children?: React.ReactNode; // Make children optional as Outlet will be used
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  // Show sidebar for any of the dashboard paths
  const dashboardPaths = ['/admin-dashboard', '/owner-dashboard', '/attendant-dashboard', '/dashboard', '/guests', '/rooms', '/reservations'];
  const showSidebar = dashboardPaths.some(path => location.pathname.startsWith(path));

  return (
    <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
      {showSidebar && <Sidebar />}
      <div className={`flex flex-col flex-1 overflow-hidden ${showSidebar ? "ml-0" : "w-full"}`}> {/* Adjusted margin/width logic slightly */}
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          {children || <Outlet />} {/* Render children if provided, otherwise Outlet */}
        </main>
      </div>
    </div>
  );
};

export default Layout;