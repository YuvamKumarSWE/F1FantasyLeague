import Navbar from '../components/Navbar';

function Standings() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Championship Standings</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Driver Standings */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Driver Championship</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pos</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Driver</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Points</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { pos: 1, driver: "Max Verstappen", team: "Red Bull Racing", points: 350 },
                    { pos: 2, driver: "Charles Leclerc", team: "Ferrari", points: 310 },
                    { pos: 3, driver: "Lewis Hamilton", team: "Mercedes", points: 285 },
                    { pos: 4, driver: "Lando Norris", team: "McLaren", points: 265 },
                    { pos: 5, driver: "George Russell", team: "Mercedes", points: 240 },
                    { pos: 6, driver: "Carlos Sainz", team: "Ferrari", points: 220 },
                    { pos: 7, driver: "Sergio Pérez", team: "Red Bull Racing", points: 195 },
                    { pos: 8, driver: "Fernando Alonso", team: "Aston Martin", points: 165 },
                  ].map((driver) => (
                    <tr key={driver.pos}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{driver.pos}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{driver.driver}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.team}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Constructor Standings */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Constructor Championship</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pos</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Constructor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Points</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { pos: 1, constructor: "Red Bull Racing", points: 545 },
                    { pos: 2, constructor: "Ferrari", points: 530 },
                    { pos: 3, constructor: "Mercedes", points: 525 },
                    { pos: 4, constructor: "McLaren", points: 420 },
                    { pos: 5, constructor: "Aston Martin", points: 285 },
                    { pos: 6, constructor: "Alpine", points: 165 },
                    { pos: 7, constructor: "Williams", points: 85 },
                    { pos: 8, constructor: "AlphaTauri", points: 45 },
                  ].map((constructor) => (
                    <tr key={constructor.pos}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{constructor.pos}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{constructor.constructor}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{constructor.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Championship Battle</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Max Verstappen vs Charles Leclerc</span>
                <span className="text-sm text-gray-500">40 points gap</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Red Bull vs Ferrari (Constructors)</span>
                <span className="text-sm text-gray-500">15 points gap</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full" style={{ width: '51%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Standings;
