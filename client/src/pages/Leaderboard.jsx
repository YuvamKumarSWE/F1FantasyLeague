import Navbar from '../components/Navbar';

function Leaderboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Fantasy League Leaderboard</h1>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Overall Standings</h2>
              <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                <option>Overall</option>
                <option>This Season</option>
                <option>Last 5 Races</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Race</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { rank: 1, name: "Alice Johnson", points: 1650, lastRace: 95, trend: "up" },
                  { rank: 2, name: "Bob Smith", points: 1598, lastRace: 78, trend: "down" },
                  { rank: 3, name: "Charlie Brown", points: 1543, lastRace: 102, trend: "up" },
                  { rank: 4, name: "Diana Prince", points: 1489, lastRace: 65, trend: "same" },
                  { rank: 5, name: "Eve Wilson", points: 1432, lastRace: 88, trend: "up" },
                  { rank: 6, name: "Frank Miller", points: 1398, lastRace: 72, trend: "down" },
                  { rank: 7, name: "Grace Lee", points: 1365, lastRace: 91, trend: "up" },
                  { rank: 8, name: "Henry Clark", points: 1312, lastRace: 55, trend: "down" },
                  { rank: 9, name: "Ivy Thompson", points: 1289, lastRace: 84, trend: "up" },
                  { rank: 10, name: "Jack Davis", points: 1265, lastRace: 76, trend: "same" },
                  { rank: 11, name: "Karen White", points: 1254, lastRace: 69, trend: "down" },
                  { rank: 12, name: "Liam Brown", points: 1248, lastRace: 87, trend: "up" },
                  { rank: 13, name: "Maya Patel", points: 1245, lastRace: 73, trend: "same" },
                ].map((player) => (
                  <tr key={player.rank} className={player.name === "John Doe" ? "bg-blue-50" : ""}>
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
                      <div className="text-sm font-medium text-gray-900">{player.name}</div>
                      {player.name === "John Doe" && (
                        <div className="text-xs text-blue-600 font-medium">You</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{player.points}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.lastRace}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {player.trend === 'up' && <span className="text-green-600">↗</span>}
                      {player.trend === 'down' && <span className="text-red-600">↘</span>}
                      {player.trend === 'same' && <span className="text-gray-400">→</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Position</h3>
            <p className="text-3xl font-bold text-blue-600">#23</p>
            <p className="text-sm text-gray-500">Out of 156 players</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Points to Top 10</h3>
            <p className="text-3xl font-bold text-orange-600">20</p>
            <p className="text-sm text-gray-500">Keep climbing!</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Best Week</h3>
            <p className="text-3xl font-bold text-green-600">105</p>
            <p className="text-sm text-gray-500">Hungarian GP</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Leaderboard;
