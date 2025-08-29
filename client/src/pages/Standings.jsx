import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
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
      <Layout title="Championship Standings">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF1801] mx-auto"></div>
            <p className="text-lg text-gray-300 mt-4">Loading standings...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout title="Championship Standings">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-400 text-lg font-medium">Error loading standings</div>
            <p className="text-gray-400 mt-2">{error}</p>
            <button
              onClick={fetchStandings}
              className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF1801] to-red-600 text-white hover:from-red-600 hover:to-[#FF1801] transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Not authenticated state
  if (!isAuthenticated) {
    return (
      <Layout title="Championship Standings">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-lg font-medium text-gray-300">Please log in to view standings</div>
            <p className="text-gray-400 mt-2">You need to be authenticated to access this page</p>
          </div>
        </div>
      </Layout>
    );
  }

  const getPositionColor = (position) => {
    if (position === 1) return 'text-yellow-400 font-bold';
    if (position === 2) return 'text-gray-400 font-bold';
    if (position === 3) return 'text-yellow-600 font-bold';
    return 'text-white';
  };

  const getPositionIcon = (position) => {
    if (position === 1) return '🏆';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return '';
  };

  return (
    <Layout title="Championship Standings">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-black mb-2">Championship Standings</h1>
          <p className="text-gray-300">Live points and championship battles</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Driver Standings */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10">
              <h2 className="text-xl font-bold">Driver Championship</h2>
              <p className="text-sm text-gray-400">{standings.length} drivers competing</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Pos</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Driver</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Team</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Points</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Wins</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {standings.map((driver) => (
                    <tr key={driver.driverId} className={driver.position <= 3 ? 'bg-yellow-500/10' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center">
                          <span className={getPositionColor(driver.position)}>
                            {getPositionIcon(driver.position)} {driver.position}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {driver.driver.name} {driver.driver.surname}
                        </div>
                        <div className="text-sm text-gray-400">
                          #{driver.driver.number} • {driver.driver.nationality}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {driver.team.teamName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#FF1801]">
                        {driver.points}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {driver.wins}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Constructor Standings */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10">
              <h2 className="text-xl font-bold">Constructor Championship</h2>
              <p className="text-sm text-gray-400">{constructorArray.length} teams battling</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Pos</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Constructor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Points</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Titles</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {constructorArray.map((constructor) => (
                    <tr key={constructor.teamId} className={constructor.position <= 3 ? 'bg-yellow-500/10' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={getPositionColor(constructor.position)}>
                          {getPositionIcon(constructor.position)} {constructor.position}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {constructor.teamName}
                        </div>
                        <div className="text-sm text-gray-400">
                          {constructor.country}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#FF1801]">
                        {constructor.totalPoints}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
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
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Championship Battle</h2>
            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">
                    {standings[0]?.driver.name} {standings[0]?.driver.surname} vs {standings[1]?.driver.name} {standings[1]?.driver.surname}
                  </span>
                  <span className="text-sm text-gray-400">
                    {standings[0]?.points - standings[1]?.points} points gap
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-[#FF1801] to-red-600 h-3 rounded-full"
                    style={{
                      width: `${Math.min((standings[0]?.points / (standings[0]?.points + standings[1]?.points)) * 100, 100)}%`
                    }}
                  ></div>
                </div>
              </div>

              {constructorArray.length >= 2 && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">
                      {constructorArray[0]?.teamName} vs {constructorArray[1]?.teamName}
                    </span>
                    <span className="text-sm text-gray-400">
                      {constructorArray[0]?.totalPoints - constructorArray[1]?.totalPoints} points gap
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-blue-400 h-3 rounded-full"
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
      </div>
    </Layout>
  );
}

export default Standings;
