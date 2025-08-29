import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children, title }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-white">
      {/* Simple Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#FF1801] to-red-600 grid place-items-center">
                <span className="font-bold font-f1">F1</span>
              </div>
              <span className="font-f1 text-xl tracking-wide">Fantasy League</span>
            </Link>
            {title && (
              <>
                <div className="h-6 w-px bg-white/20"></div>
                <h1 className="text-lg font-semibold text-gray-300">{title}</h1>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
            >
              ← Back to Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative mx-auto max-w-7xl px-6 py-8">
        {/* Background Effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 right-0 h-80 w-80 rounded-full bg-[#FF1801]/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-10 h-96 w-96 rounded-full bg-red-500/3 blur-3xl" />
        </div>

        <div className="relative">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/60 mt-16">
        <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-[#FF1801] to-red-600 grid place-items-center text-sm font-bold">F1</div>
            <span className="font-f1">Fantasy League</span>
          </div>
          <p className="text-xs text-gray-400">© 2025 F1 Fantasy League. Built for race fans.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;