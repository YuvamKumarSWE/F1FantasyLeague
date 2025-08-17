import Navbar from '../components/Navbar';

function Results() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Race Results</h1>
        
        <div className="space-y-6">
          {[
            { race: "Hungarian Grand Prix", date: "August 3, 2025", circuit: "Hungaroring" },
            { race: "British Grand Prix", date: "July 20, 2025", circuit: "Silverstone" },
            { race: "Austrian Grand Prix", date: "July 6, 2025", circuit: "Red Bull Ring" },
          ].map((raceInfo, index) => (
            <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{raceInfo.race}</h2>
                    <p className="text-sm text-gray-600">{raceInfo.circuit} • {raceInfo.date}</p>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Driver</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Constructor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Points</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      { pos: 1, driver: "Max Verstappen", constructor: "Red Bull Racing", points: 25 },
                      { pos: 2, driver: "Lewis Hamilton", constructor: "Mercedes", points: 18 },
                      { pos: 3, driver: "Charles Leclerc", constructor: "Ferrari", points: 15 },
                      { pos: 4, driver: "Lando Norris", constructor: "McLaren", points: 12 },
                      { pos: 5, driver: "George Russell", constructor: "Mercedes", points: 10 },
                    ].map((result, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.pos}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.driver}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.constructor}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Results;
