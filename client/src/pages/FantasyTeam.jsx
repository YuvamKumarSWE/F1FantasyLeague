import Navbar from '../components/Navbar';

function FantasyTeam() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Fantasy Team</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Team */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Current Team</h2>
            
            <div className="space-y-6">
              {/* Drivers */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Drivers</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Max Verstappen</p>
                      <p className="text-sm text-gray-500">Red Bull Racing</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">$25.0M</p>
                      <p className="text-sm text-green-600">+45 pts</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Lewis Hamilton</p>
                      <p className="text-sm text-gray-500">Mercedes</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">$22.5M</p>
                      <p className="text-sm text-green-600">+28 pts</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Constructor */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Constructor</h3>
                <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Red Bull Racing</p>
                    <p className="text-sm text-gray-500">Constructor</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">$30.0M</p>
                    <p className="text-sm text-green-600">+65 pts</p>
                  </div>
                </div>
              </div>
              
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors">
                Edit Team
              </button>
            </div>
          </div>
          
          {/* Team Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Budget:</span>
                  <span className="font-medium">$100.0M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Spent:</span>
                  <span className="font-medium">$77.5M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining:</span>
                  <span className="font-medium text-green-600">$22.5M</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Points:</span>
                  <span className="font-medium">1,245</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Race:</span>
                  <span className="font-medium text-green-600">+85 pts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average:</span>
                  <span className="font-medium">78.5 pts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default FantasyTeam;
