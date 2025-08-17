import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { standingsService } from '../services/standingsService';

function Standings() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStandings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await standingsService.getStandings();
      if (data.success) {
        setStandings(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch standings');
      }
    } catch (error) {
      console.error('Error fetching standings:', error);
      setError('Unable to load standings data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchStandings();
    }
  }, [authLoading]);

  // Group standings by team for constructor championship
  const constructorStandings = standings.reduce((acc, driver) => {
    const teamId = driver.teamId;
    if (!acc[teamId]) {
      acc[teamId] = {
        teamName: driver.team.teamName,
        teamId: teamId,
        totalPoints: 0,
        drivers: [],
        country: driver.team.country,
        championships: driver.team.constructorsChampionships
      };
    }
    acc[teamId].totalPoints += driver.points;
    acc[teamId].drivers.push({
      name: `${driver.driver.name} ${driver.driver.surname}`,
      points: driver.points
    });
    return acc;
  }, {});

  const constructorArray = Object.values(constructorStandings)
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((team, index) => ({ ...team, position: index + 1 }));

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-lg text-gray-600 mt-4">Loading standings...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-red-600 text-lg font-medium">Error loading standings</div>
              <p className="text-gray-600 mt-2">{error}</p>
              <button 
                onClick={fetchStandings}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Not authenticated state
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-lg font-medium text-gray-900">Please log in to view standings</div>
              <p className="text-gray-600 mt-2">You need to be authenticated to access this page</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const getPositionColor = (position) => {
    if (position === 1) return 'text-yellow-600 font-bold';
    if (position === 2) return 'text-gray-600 font-bold';
    if (position === 3) return 'text-yellow-700 font-bold';
    return 'text-gray-900';
  };

  const getPositionIcon = (position) => {
    if (position === 1) return '🏆';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return '';
  };

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
              <p className="text-sm text-gray-600">{standings.length} drivers</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pos</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Driver</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Points</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Wins</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {standings.map((driver) => (
                    <tr key={driver.driverId} className={driver.position <= 3 ? 'bg-yellow-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center">
                          <span className={getPositionColor(driver.position)}>
                            {getPositionIcon(driver.position)} {driver.position}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {driver.driver.name} {driver.driver.surname}
                        </div>
                        <div className="text-sm text-gray-500">
                          #{driver.driver.number} • {driver.driver.nationality}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {driver.team.teamName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                        {driver.points}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {driver.wins}
                      </td>
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
              <p className="text-sm text-gray-600">{constructorArray.length} teams</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pos</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Constructor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Points</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Titles</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {constructorArray.map((constructor) => (
                    <tr key={constructor.teamId} className={constructor.position <= 3 ? 'bg-yellow-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={getPositionColor(constructor.position)}>
                          {getPositionIcon(constructor.position)} {constructor.position}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {constructor.teamName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {constructor.country}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                        {constructor.totalPoints}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {constructor.championships}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Championship Battle */}
        {standings.length >= 2 && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Championship Battle</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {standings[0]?.driver.name} {standings[0]?.driver.surname} vs {standings[1]?.driver.name} {standings[1]?.driver.surname}
                  </span>
                  <span className="text-sm text-gray-500">
                    {standings[0]?.points - standings[1]?.points} points gap
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ 
                      width: `${Math.min((standings[0]?.points / (standings[0]?.points + standings[1]?.points)) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              {constructorArray.length >= 2 && (
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {constructorArray[0]?.teamName} vs {constructorArray[1]?.teamName} (Constructors)
                    </span>
                    <span className="text-sm text-gray-500">
                      {constructorArray[0]?.totalPoints - constructorArray[1]?.totalPoints} points gap
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full" 
                      style={{ 
                        width: `${Math.min((constructorArray[0]?.totalPoints / (constructorArray[0]?.totalPoints + constructorArray[1]?.totalPoints)) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Standings;
