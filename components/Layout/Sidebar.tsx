
import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/', icon: 'fa-chart-line', label: 'Dashboard' },
    { to: '/routines', icon: 'fa-calendar-alt', label: 'Routines' },
    { to: '/history', icon: 'fa-history', label: 'History' },
    { to: '/profile', icon: 'fa-user-circle', label: 'Profile' },
  ];

  return (
    <nav className="w-full md:w-64 bg-slate-900 text-white flex flex-row md:flex-col border-r border-slate-800 sticky top-0 md:h-screen z-50">
      <div className="p-4 md:p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
          <i className="fas fa-dumbbell text-xl"></i>
        </div>
        <span className="text-xl font-bold tracking-tight hidden md:block">IronPath AI</span>
      </div>

      <div className="flex-1 flex flex-row md:flex-col justify-around md:justify-start overflow-x-auto md:overflow-x-visible">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-4 transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600/10 text-indigo-400 border-b-2 md:border-b-0 md:border-l-4 border-indigo-600'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <i className={`fas ${item.icon} text-lg w-6 text-center`}></i>
            <span className="font-medium hidden md:block">{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="hidden md:block p-6 mt-auto">
        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
          <p className="text-xs text-slate-400 uppercase font-bold mb-1">Weekly Streak</p>
          <div className="flex gap-1">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-6 h-6 rounded bg-indigo-500 flex items-center justify-center text-[10px]"><i className="fas fa-check"></i></div>
            ))}
            {[4, 5, 6, 7].map(i => (
              <div key={i} className="w-6 h-6 rounded bg-slate-700"></div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
