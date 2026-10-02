import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { ToastContainer } from '../common/ToastContainer';
import { JobProgressModal } from '../common/JobProgressModal';

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-cine-950 text-slate-100 flex flex-col font-sans selection:bg-cine-gold selection:text-black">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Container */}
      <div className="flex flex-1">
        {/* Left Navigation Sidebar */}
        <Sidebar />

        {/* Dynamic Page Content */}
        <main className="flex-1 min-w-0 p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>

      {/* Global Overlays */}
      <ToastContainer />
      <JobProgressModal />
    </div>
  );
};
