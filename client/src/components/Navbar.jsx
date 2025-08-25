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
    <nav className="bg-red-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-white text-xl font-bold">F1 Fantasy</h1>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`${
                    location.pathname === item.path
                      ? 'border-white text-white'
                      : 'border-transparent text-red-100 hover:border-red-300 hover:text-white'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <span className="text-white text-sm">
              Welcome, {user?.username || user?.email || 'User'}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-700 hover:bg-red-800 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Logout
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-red-100 hover:text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
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

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`${
                  location.pathname === item.path
                    ? 'bg-red-700 text-white'
                    : 'text-red-100 hover:bg-red-700 hover:text-white'
                } block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-red-700 pt-4">
              <div className="px-3 py-2 text-red-100 text-sm">
                Welcome, {user?.username || user?.email || 'User'}
              </div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-100 hover:bg-red-700 hover:text-white transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
