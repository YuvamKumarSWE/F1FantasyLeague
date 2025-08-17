import { useEffect, useState } from 'react';
import { leaderboardService } from '../services/leaderboardService';
import { useAuth } from '../context/AuthContext';

function UserRankCard() {
  const { loading: authLoading, isAuthenticated } = useAuth();
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const fetchUserRank = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await leaderboardService.getMyRank();
          if (response && response.success) {
            
            setUserRank(response.user);
          } else {
            setError('Failed to fetch your rank');
          }
        } catch (error) {
          console.error('Error fetching user rank:', error);
          setError('Unable to load your rank data');
        } finally {
          setLoading(false);
        }
      };

      fetchUserRank();
    }
  }, [authLoading, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
        <div className="text-center text-gray-600">
          <p className="text-lg font-medium">Login to see your rank</p>
          <p className="text-sm mt-1">Create an account to join the fantasy league</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-blue-700 mt-2">Loading your stats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-lg border border-red-200 p-6">
        <div className="text-center text-red-700">
          <p className="font-medium">Error loading rank</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!userRank) {
    return (
      <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6">
        <div className="text-center text-yellow-700">
          <p className="font-medium">No rank data available</p>
          <p className="text-sm mt-1">Join the fantasy league to get ranked</p>
        </div>
      </div>
    );
  }

  const getRankColor = (rank) => {
    if (rank === 1) return 'text-yellow-600';
    if (rank === 2) return 'text-gray-600';
    if (rank === 3) return 'text-yellow-700';
    return 'text-blue-600';
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return '🏆';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '🏎️';
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6 shadow-sm">
      <div className="text-center">
        <div className="flex items-center justify-center mb-3">
          <span className="text-2xl mr-2">{getRankIcon(userRank.rank)}</span>
          <h3 className="text-xl font-bold text-gray-900">Your Performance</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600 font-medium">Current Rank</p>
            <p className={`text-2xl font-bold ${getRankColor(userRank.rank)}`}>
              #{userRank.rank}
            </p>
            <p className="text-xs text-gray-500">of {userRank.totalUsers} players</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600 font-medium">Fantasy Points</p>
            <p className="text-2xl font-bold text-green-600">{userRank.fantasyPoints}</p>
            <p className="text-xs text-gray-500">Total earned</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600 font-medium">Username</p>
            <p className="text-lg font-semibold text-gray-900">{userRank.username}</p>
            <p className="text-xs text-gray-500">Your identity</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserRankCard;