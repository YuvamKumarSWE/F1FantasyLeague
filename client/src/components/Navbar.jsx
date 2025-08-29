import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/landing');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Drivers', path: '/drivers' },
    { name: 'Constructors', path: '/constructors' },
    { name: 'Fantasy Team', path: '/fantasy-team' },
    { name: 'Races', path: '/races' },
    { name: 'Standings', path: '/standings' },
    { name: 'Leaderboard', path: '/leaderboard' },
  ];

  return (
    <nav className="bg-black/95 backdrop-blur-lg shadow-2xl border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/dashboard" className="flex items-center group">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-500 rounded-xl flex items-center justify-center mr-3 group-hover:scale-105 transition-transform duration-300">
                  <span className="text-white text-lg font-bold font-f1">F1</span>
                </div>
                <span className="text-white text-xl font-bold font-f1 group-hover:text-red-400 transition-colors duration-300">
                  FANTASY LEAGUE
                </span>
              </Link>
            </div>
            <div className="hidden lg:ml-8 lg:flex lg:space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`${
                    location.pathname === item.path
                      ? 'text-red-400 bg-red-500/20 border-red-400'
                      : 'text-gray-300 hover:text-white hover:bg-white/10 border-transparent'
                  } inline-flex items-center px-4 py-2 border-b-2 text-sm font-semibold transition-all duration-300 rounded-t-lg`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden lg:ml-6 lg:flex lg:items-center lg:space-x-6">
            <div className="glass px-4 py-2 rounded-lg">
              <span className="text-gray-300 text-sm font-medium">
                Welcome, <span className="text-red-400 font-semibold">{user?.username || user?.email || 'Driver'}</span>
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-red-500/25"
            >
              LOGOUT
            </button>
          </div>

          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-black/98 backdrop-blur-lg border-t border-white/10">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`${
                  location.pathname === item.path
                    ? 'bg-red-500/20 text-red-400 border-red-400'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white border-transparent'
                } block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 border-l-4`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-white/10 pt-4 mt-6">
              <div className="px-4 py-3 text-gray-300 text-sm font-medium glass rounded-xl mb-4">
                Welcome, <span className="text-red-400 font-semibold">{user?.username || user?.email || 'Driver'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-4 py-3 rounded-xl text-base font-bold transition-all duration-300"
              >
                LOGOUT
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
