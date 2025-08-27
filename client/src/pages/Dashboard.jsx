import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import UserRankCard from '../components/UserRankCard';
import NextRace from '../components/NextRace';
import CurrentTeam from '../components/CurrentTeam';
import { Link } from 'react-router-dom';
import { raceService } from '../services';

function Dashboard() {
  const [nextRace, setNextRace] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const getDeadline = () => {
    if (!nextRace?.schedule?.fp1) return null;
    const fp1Date = new Date(nextRace.schedule.fp1);
    // Set to start of day (00:00 AM) to match backend logic
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

  const quickLinks = [
    { name: 'Drivers', path: '/drivers', icon: '🏎️', description: 'View all F1 drivers and their stats' },
    { name: 'Constructors', path: '/constructors', icon: '🏭', description: 'Explore F1 teams and their performance' },
    { name: 'Standings', path: '/standings', icon: '📊', description: 'Current championship standings' },
    { name: 'Leaderboard', path: '/leaderboard', icon: '🥇', description: 'Fantasy league rankings' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Monitor your team performance and race strategy</p>
        </div>

        {/* Team Selection Deadline Section */}
        {!loading && nextRace && (
          <div className="mb-8">
            <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${
              isDeadlinePassed() ? 'border-red-500' : 'border-yellow-500'
            }`}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Team Selection Deadline</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Race Weekend</p>
                  <p className="font-semibold text-gray-900">{nextRace.raceName}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Deadline</p>
                  <p className="font-semibold text-gray-900">{formatDeadline()}</p>
                </div>
                
                <div className={`rounded-lg p-4 ${
                  isDeadlinePassed() ? 'bg-red-50' : 'bg-yellow-50'
                }`}>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <p className={`font-semibold ${
                    isDeadlinePassed() ? 'text-red-700' : 'text-yellow-700'
                  }`}>
                    {isDeadlinePassed() ? 'Deadline Passed' : `${getTimeUntilDeadline()} remaining`}
                  </p>
                </div>
              </div>
              
              {!isDeadlinePassed() && (
                <div className="mt-4 flex justify-end">
                  <Link
                    to="/fantasy-team"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Create/Edit Team
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Access Links Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">{link.icon}</span>
                  <h3 className="font-semibold text-gray-900">{link.name}</h3>
                </div>
                <p className="text-sm text-gray-600">{link.description}</p>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Current F1 Team */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Racing Team</h2>
              <CurrentTeam />
            </div>
          </div>
          
          {/* Right column with stats and race info */}
          <div className="space-y-6">
            {/* User Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Championship Position</h2>
              <UserRankCard />
            </div>
            
            {/* Next Race Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Next Grand Prix</h2>
              <NextRace />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
