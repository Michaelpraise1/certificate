import React, { useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function DashboardLayout() {

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white dark:bg-black border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
           <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">GC</div>
           <span className="font-semibold text-lg dark:text-white">Certification</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
           <Link to="/dashboard" className="block px-4 py-2.5 rounded-md text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
             Overview
           </Link>
           <Link to="/dashboard/create-certification" className="block px-4 py-2.5 rounded-md text-sm font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 transition-colors">
             Create Certification
           </Link>
        </nav>
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
           <Link 
             to="/login" 
             onClick={() => {
               localStorage.removeItem('token');
               localStorage.removeItem('isAuthenticated');
             }}
             className="block px-4 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
           >
             Log out
           </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto p-6 md:p-10 w-full min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
