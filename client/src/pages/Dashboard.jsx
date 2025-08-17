import Navbar from '../components/Navbar';

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Current F1 Team - Large box */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Current F1 Team for Next Race
            </h2>
            <div className="space-y-3">
              <div className="text-gray-600">
                <p><strong>Driver 1:</strong> Max Verstappen</p>
                <p><strong>Driver 2:</strong> Lewis Hamilton</p>
                <p><strong>Constructor:</strong> Red Bull Racing</p>
                <p><strong>Budget Remaining:</strong> $5.2M</p>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Edit Team
              </button>
            </div>
          </div>
          
          {/* User Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Your Stats
            </h2>
            <div className="space-y-2 text-gray-600">
              <p><strong>Total Points:</strong> 1,245</p>
              <p><strong>Rank:</strong> #23</p>
              <p><strong>Races Played:</strong> 8</p>
              <p><strong>Best Finish:</strong> #5</p>
            </div>
          </div>
          
          {/* Next Race Details */}
          <div className="md:col-span-2 lg:col-span-1 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Next Race
            </h2>
            <div className="space-y-2 text-gray-600">
              <p><strong>Race:</strong> Belgian Grand Prix</p>
              <p><strong>Circuit:</strong> Spa-Francorchamps</p>
              <p><strong>Date:</strong> August 25, 2025</p>
              <p><strong>Time:</strong> 15:00 CET</p>
              <p><strong>Weather:</strong> Partly Cloudy</p>
            </div>
            <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
              View Details
            </button>
          </div>
          
          {/* Leaderboard */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Top 10 Leaderboard
            </h2>
            <div className="space-y-2">
              {[
                { rank: 1, name: "Alice Johnson", points: 1650 },
                { rank: 2, name: "Bob Smith", points: 1598 },
                { rank: 3, name: "Charlie Brown", points: 1543 },
                { rank: 4, name: "Diana Prince", points: 1489 },
                { rank: 5, name: "Eve Wilson", points: 1432 },
              ].map((player) => (
                <div key={player.rank} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="flex items-center">
                    <span className="w-6 text-center font-medium text-gray-700">#{player.rank}</span>
                    <span className="ml-3 text-gray-900">{player.name}</span>
                  </div>
                  <span className="font-medium text-blue-600">{player.points} pts</span>
                </div>
              ))}
            </div>
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              View Full Leaderboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
