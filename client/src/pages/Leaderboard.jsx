import Navbar from '../components/Navbar';
import UserRankCard from '../components/UserRankCard';
import { useEffect, useState } from 'react';
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
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">Loading...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Fantasy League Leaderboard</h1>
        
        {/* User Rank Card */}
        <div className="mb-8">
          <UserRankCard />
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Overall Standings</h2>
              <p className="text-sm text-gray-600">Top {leaderboardData.length} Players</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboardData.length > 0 ? (
                  leaderboardData.map((player) => (
                    <tr key={player.rank}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center">
                          {player.rank <= 3 && (
                            <span className={`w-6 h-6 rounded-full text-white text-xs flex items-center justify-center mr-2 ${
                              player.rank === 1 ? 'bg-yellow-500' : 
                              player.rank === 2 ? 'bg-gray-400' : 'bg-yellow-600'
                            }`}>
                              {player.rank}
                            </span>
                          )}
                          {player.rank > 3 && <span className="mr-8">#{player.rank}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{player.username}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{player.fantasyPoints}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                      No leaderboard data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Leaderboard;
