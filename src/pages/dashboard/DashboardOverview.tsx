import React from 'react';

export default function DashboardOverview() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Dashboard Overview</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Welcome back! Manage and issue new certifications from here.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col justify-center">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Total Issued</p>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">124</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col justify-center">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Active Programs</p>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">8</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col justify-center">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Revoked</p>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">2</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm min-h-[300px] flex items-center justify-center">
        <p className="text-zinc-500 dark:text-zinc-400 text-center">
          No recent activity to show.<br />
          Start by establishing a new certification block.
        </p>
      </div>
    </div>
  );
}
