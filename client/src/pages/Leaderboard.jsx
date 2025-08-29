import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import UserRankCard from '../components/UserRankCard';
import { leaderboardService } from '../services/leaderboardService';
import { useAuth } from '../context/AuthContext';

function Leaderboard() {
  const { loading: authLoading } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    // Only fetch leaderboard data after auth is verified
    if (!authLoading) {
      const fetchLeaderboard = async () => {
        try {
          setDataLoading(true);
          const data = await leaderboardService.getLeaderboard();
          if (!data || !data.success) {
            console.error('Error fetching leaderboard:', data.message || 'Failed to fetch leaderboard');
            setLeaderboardData([]);
          } else {
            setLeaderboardData(data.leaderboard || []);
          }
        } catch (error) {
          console.error('Error fetching leaderboard:', error);
          setLeaderboardData([]);
        } finally {
          setDataLoading(false);
        }
      };

      fetchLeaderboard();
    }
  }, [authLoading]);

  // Show loading while auth is being verified OR data is being fetched
  if (authLoading || dataLoading) {
    return (
      <Layout title="Fantasy Leaderboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF1801] mx-auto"></div>
            <p className="text-lg text-gray-300 mt-4">Loading leaderboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Fantasy Leaderboard">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-black mb-2">Fantasy League Rankings</h1>
          <p className="text-gray-300">Compete with fellow F1 enthusiasts</p>
        </div>

        {/* User Rank Card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <UserRankCard />
        </div>

        {/* Leaderboard Table */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Global Standings</h2>
              <p className="text-sm text-gray-400">Top {leaderboardData.length} Players</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Player</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {leaderboardData.length > 0 ? (
                  leaderboardData.map((player) => (
                    <tr key={player.rank} className={player.rank <= 3 ? 'bg-yellow-500/10' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center">
                          {player.rank <= 3 && (
                            <span className={`w-8 h-8 rounded-full text-white text-sm flex items-center justify-center mr-3 font-bold ${
                              player.rank === 1 ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' :
                              player.rank === 2 ? 'bg-gradient-to-br from-gray-400 to-gray-500' : 'bg-gradient-to-br from-yellow-600 to-yellow-700'
                            }`}>
                              {player.rank === 1 ? '🏆' : player.rank === 2 ? '🥈' : '🥉'}
                            </span>
                          )}
                          {player.rank > 3 && <span className="text-white font-semibold">#{player.rank}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{player.username}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#FF1801]">{player.fantasyPoints}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-gray-400">
                      No leaderboard data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Leaderboard;
