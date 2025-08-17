import Navbar from '../components/Navbar';

function Races() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Race Calendar</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: "Belgian Grand Prix", circuit: "Spa-Francorchamps", date: "August 25, 2025", status: "upcoming" },
            { name: "Dutch Grand Prix", circuit: "Circuit Zandvoort", date: "September 1, 2025", status: "upcoming" },
            { name: "Italian Grand Prix", circuit: "Monza", date: "September 8, 2025", status: "upcoming" },
            { name: "Hungarian Grand Prix", circuit: "Hungaroring", date: "August 3, 2025", status: "completed" },
            { name: "British Grand Prix", circuit: "Silverstone", date: "July 20, 2025", status: "completed" },
            { name: "Austrian Grand Prix", circuit: "Red Bull Ring", date: "July 6, 2025", status: "completed" },
          ].map((race, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{race.name}</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  race.status === 'upcoming' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {race.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p><strong>Circuit:</strong> {race.circuit}</p>
                <p><strong>Date:</strong> {race.date}</p>
              </div>
              <button className={`w-full py-2 px-4 rounded-md transition-colors ${
                race.status === 'upcoming'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}>
                {race.status === 'upcoming' ? 'View Details' : 'View Results'}
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Season Progress</h2>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-blue-600 h-3 rounded-full" style={{ width: '45%' }}></div>
          </div>
          <p className="mt-2 text-sm text-gray-600">9 of 20 races completed</p>
        </div>
      </main>
    </div>
  );
}

export default Races;
