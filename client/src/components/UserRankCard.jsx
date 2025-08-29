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
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <div className="text-center">
          <div className="text-2xl mb-3">🏎️</div>
          <p className="text-lg font-semibold text-white mb-1">Login Required</p>
          <p className="text-sm text-gray-400">Create an account to join the fantasy league</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF1801] mx-auto mb-3"></div>
          <p className="text-[#FF1801] font-medium">Loading your stats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
        <div className="text-center">
          <div className="text-red-400 mb-2">⚠️</div>
          <p className="font-semibold text-red-400">Error loading rank</p>
          <p className="text-sm text-red-300 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!userRank) {
    return (
      <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-6">
        <div className="text-center">
          <div className="text-yellow-400 mb-2">🎯</div>
          <p className="font-semibold text-yellow-400">No rank data available</p>
          <p className="text-sm text-yellow-300 mt-1">Join the fantasy league to get ranked</p>
        </div>
      </div>
    );
  }

  const getRankColor = (rank) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-orange-400';
    return 'text-[#FF1801]';
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return '🏆';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '🏎️';
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <span className="text-3xl mr-3">{getRankIcon(userRank.rank)}</span>
          <h3 className="text-xl font-bold text-white">Your Performance</h3>
        </div>

        {/* Rank Badge */}
        <div className="mb-6">
          <div className={`inline-flex items-center px-4 py-2 rounded-full border ${
            userRank.rank <= 3
              ? 'border-yellow-500/20 bg-yellow-500/10'
              : 'border-[#FF1801]/20 bg-[#FF1801]/10'
          }`}>
            <span className={`text-2xl font-black ${getRankColor(userRank.rank)} mr-2`}>
              #{userRank.rank}
            </span>
            <span className="text-sm text-gray-400">
              of {userRank.totalUsers} drivers
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-medium">Fantasy Points</p>
                <p className="text-2xl font-black text-green-400">{userRank.fantasyPoints}</p>
              </div>
              <div className="text-right">
                <div className="text-green-400">📈</div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-400 font-medium">Driver</p>
                <p className="text-lg font-bold text-white truncate">{userRank.username}</p>
              </div>
              <div className="ml-3 flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#FF1801] to-red-600 grid place-items-center text-sm font-bold text-white">
                  {userRank.username?.charAt(0)?.toUpperCase() || 'D'}
                </div>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
}

export default UserRankCard;