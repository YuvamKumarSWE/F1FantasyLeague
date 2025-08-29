import { useState, useEffect } from 'react';
import UserRankCard from '../components/UserRankCard';
import NextRace from '../components/NextRace';
import CurrentTeam from '../components/CurrentTeam';
import { Link, useNavigate } from 'react-router-dom';
import { raceService } from '../services';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const [nextRace, setNextRace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNextRace = async () => {
      try {
        const response = await raceService.getNextRace();
        if (response.success) {
          setNextRace(response.data);
        }
      } catch (err) {
        console.error('Error fetching next race:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNextRace();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const getDeadline = () => {
    if (!nextRace?.schedule?.fp1) return null;
    const fp1Date = new Date(nextRace.schedule.fp1);
    fp1Date.setHours(0, 0, 0, 0);
    return fp1Date;
  };

  const isDeadlinePassed = () => {
    const deadline = getDeadline();
    if (!deadline) return false;
    return new Date() >= deadline;
  };

  const formatDeadline = () => {
    const deadline = getDeadline();
    if (!deadline) return 'Unknown';
    return deadline.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeUntilDeadline = () => {
    const deadline = getDeadline();
    if (!deadline) return 'Unknown';

    const now = new Date();
    const timeDiff = deadline - now;

    if (timeDiff <= 0) return 'Deadline passed';

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const bottomNavCards = [
    {
      name: 'Drivers',
      path: '/drivers',
      icon: '🏎️',
      description: 'Elite drivers lineup',
      color: 'from-blue-600 to-blue-400',
      stats: '20+ Drivers'
    },
    {
      name: 'Constructors',
      path: '/constructors',
      icon: '🏭',
      description: 'F1 team powerhouses',
      color: 'from-green-600 to-green-400',
      stats: '10 Teams'
    },
    {
      name: 'Leaderboard',
      path: '/leaderboard',
      icon: '🥇',
      description: 'Fantasy rankings',
      color: 'from-yellow-600 to-yellow-400',
      stats: 'Global Race'
    },
    {
      name: 'Fantasy Team',
      path: '/fantasy-team',
      icon: '⚡',
      description: 'Build your dream team',
      color: 'from-[#FF1801] to-red-500',
      stats: 'Your Squad'
    },
    {
      name: 'Races',
      path: '/races',
      icon: '🏁',
      description: 'Grand Prix schedule',
      color: 'from-purple-600 to-purple-400',
      stats: '24 Weekends'
    },
    {
      name: 'Standings',
      path: '/standings',
      icon: '📊',
      description: 'Championship rankings',
      color: 'from-orange-600 to-orange-400',
      stats: 'Live Points'
    }
  ];

  return (
    <div className="min-h-screen h-max bg-gradient-to-b from-black via-slate-950 to-black text-white flex flex-col pb-[170px]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#FF1801] to-red-600 grid place-items-center">
              <span className="font-bold font-f1">F1</span>
            </div>
            <span className="font-f1 text-xl tracking-wide">Fantasy League</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-xl border border-white/10 bg-white/5">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#FF1801] to-red-600 grid place-items-center text-sm">
                {user?.username?.charAt(0)?.toUpperCase() || 'D'}
              </div>
              <span className="text-sm text-gray-300">
                Welcome, <span className="text-[#FF1801] font-semibold">{user?.username || 'Driver'}</span>
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="hidden lg:block px-4 py-2 rounded-xl border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
            >
              Logout
            </button>
            {/* Hamburger Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-xl border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 relative mx-auto max-w-7xl px-6 py-8 w-full">
        {/* Main Content */}
        <div className="flex-1 relative w-full">
          {/* Background Effects */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-32 right-0 h-80 w-80 rounded-full bg-[#FF1801]/5 blur-3xl" />
            <div className="absolute -bottom-40 -left-10 h-96 w-96 rounded-full bg-red-500/3 blur-3xl" />
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl font-black mb-4">
              Pit Wall <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF1801] to-orange-400">Dashboard</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Command your strategy, track performance, and dominate the championship
            </p>
          </div>

          {/* Deadline Alert */}
          {!loading && nextRace && (
            <div className="mb-12">
              <div className={`relative overflow-hidden rounded-2xl border p-8 ${
                isDeadlinePassed()
                  ? 'border-red-500/20 bg-red-500/5'
                  : 'border-yellow-500/20 bg-yellow-500/5'
              }`}>
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#FF1801]/10 blur-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Team Selection Deadline</h2>
                    <div className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                      isDeadlinePassed()
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {isDeadlinePassed() ? 'CLOSED' : 'OPEN'}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="text-sm text-gray-400 mb-1">Next Race</div>
                      <div className="font-bold text-lg">{nextRace.raceName}</div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="text-sm text-gray-400 mb-1">Deadline</div>
                      <div className="font-bold text-lg">{formatDeadline()}</div>
                    </div>
                    <div className={`rounded-xl border p-4 ${
                      isDeadlinePassed()
                        ? 'border-red-500/20 bg-red-500/10'
                        : 'border-yellow-500/20 bg-yellow-500/10'
                    }`}>
                      <div className="text-sm text-gray-400 mb-1">Time Remaining</div>
                      <div className={`font-bold text-lg ${
                        isDeadlinePassed() ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                        {isDeadlinePassed() ? 'Deadline Passed' : getTimeUntilDeadline()}
                      </div>
                    </div>
                  </div>
                  {!isDeadlinePassed() && (
                    <div className="flex justify-end">
                      <Link
                        to="/fantasy-team"
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF1801] to-red-600 font-semibold text-white hover:from-red-600 hover:to-[#FF1801] transition-all duration-300 hover:shadow-lg hover:shadow-[#FF1801]/25"
                      >
                        Build Your Team
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-12">
            {/* Current Team Section */}
            <div className="xl:col-span-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Your Racing Squad</h2>
                  <Link
                    to="/fantasy-team"
                    className="text-sm text-[#FF1801] hover:text-red-400 transition-colors"
                  >
                    Manage Team →
                  </Link>
                </div>
                <CurrentTeam />
              </div>
            </div>

            {/* Stats Sidebar */}
            <div className="space-y-8">
              {/* Championship Position */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <h3 className="text-xl font-bold mb-4">Championship Standings</h3>
                <UserRankCard />
              </div>
              {/* Next Race */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <NextRace />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-40 bg-black/80 backdrop-blur border-t border-white/10 py-6 px-6">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex justify-center gap-8 max-w-7xl mx-auto overflow-x-auto">
          {bottomNavCards.map((card) => (
            <Link
              key={card.name}
              to={card.path}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] px-8 py-6 flex flex-col items-center hover:bg-white/[0.08] transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#FF1801]/10 flex-shrink-0 w-28"
            >
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${card.color} grid place-items-center text-3xl mb-3 group-hover:scale-110 transition-transform duration-300`}>
                {card.icon}
              </div>
              <span className="font-bold text-sm group-hover:text-[#FF1801] transition-colors text-center leading-tight">{card.name}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
          <div className="flex flex-col h-full">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#FF1801] to-red-600 grid place-items-center">
                  <span className="font-bold font-f1">F1</span>
                </div>
                <span className="font-f1 text-xl tracking-wide">Fantasy League</span>
              </div>
              <button
                onClick={closeMenu}
                className="p-2 rounded-xl border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Menu Content */}
            <div className="flex-1 flex flex-col p-6">
              {/* User Info */}
              <div className="mb-8 p-4 rounded-xl border border-white/10 bg-white/5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#FF1801] to-red-600 grid place-items-center text-lg">
                    {user?.username?.charAt(0)?.toUpperCase() || 'D'}
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Welcome back</div>
                    <div className="font-semibold text-[#FF1801]">{user?.username || 'Driver'}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  className="w-full px-4 py-2 rounded-xl border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition-all text-center"
                >
                  Logout
                </button>
              </div>

              {/* Navigation Items */}
              <div className="space-y-2">
                {bottomNavCards.map((card) => (
                  <Link
                    key={card.name}
                    to={card.path}
                    onClick={closeMenu}
                    className="group flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#FF1801]/10"
                  >
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${card.color} grid place-items-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
                      {card.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-lg group-hover:text-[#FF1801] transition-colors">{card.name}</div>
                      <div className="text-sm text-gray-400">{card.description}</div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-[#FF1801] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

  );

}

export default Dashboard;
