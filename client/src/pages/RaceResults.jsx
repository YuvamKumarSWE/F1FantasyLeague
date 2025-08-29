import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { resultService } from '../services';

function RaceResults() {
  const { raceId } = useParams();
  const navigate = useNavigate();

  const [raceResults, setRaceResults] = useState(null);
  const [fantasyPoints, setFantasyPoints] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('results');

  useEffect(() => {
    const fetchData = async () => {
      if (!raceId) {
        setError('Race ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch both race results and fantasy points
        const [resultsResponse, fantasyResponse] = await Promise.all([
          resultService.getRaceResults(raceId),
          resultService.getFantasyPoints(raceId)
        ]);

        if (resultsResponse.success) {
          setRaceResults(resultsResponse.data);
        } else {
          setError(resultsResponse.error);
        }

        if (fantasyResponse.success) {
          setFantasyPoints(fantasyResponse.data);
        }

      } catch (err) {
        setError('Failed to fetch race data');
        console.error('Error fetching race data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [raceId]);

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString;
  };

  const getPositionClass = (position) => {
    const pos = parseInt(position);
    if (pos === 1) return 'text-yellow-400 font-bold';
    if (pos === 2) return 'text-gray-400 font-bold';
    if (pos === 3) return 'text-orange-400 font-bold';
    if (pos <= 10) return 'text-green-400 font-semibold';
    return 'text-gray-500';
  };

  const ResultsTable = () => (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden">
      <div className="px-6 py-4 border-b border-white/10">
        <h3 className="text-xl font-bold text-white">Race Results</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/[0.04]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Driver
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Team
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Time/Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Points
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Fastest Lap
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {raceResults?.races?.results?.map((result, index) => (
              <tr key={index} className="hover:bg-white/[0.04]">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${getPositionClass(result.position)}`}>
                    {result.position}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-white">
                      {result.driver.name} {result.driver.surname}
                    </div>
                    <div className="text-sm text-gray-400">#{result.driver.number}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {result.team.teamName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {result.retired ? 'DNF' : formatTime(result.time)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                  {result.points}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-400">
                  {result.fastLap ? '⚡' : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const FantasyPointsTable = () => (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden">
      <div className="px-6 py-4 border-b border-white/10">
        <h3 className="text-xl font-bold text-white">Fantasy Points</h3>
        <p className="text-sm text-gray-400 mt-1">
          Points calculated based on race position, bonuses, and penalties
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/[0.04]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Driver
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Team
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                F1 Points
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Fantasy Points
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Captain Points
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {fantasyPoints?.driversFantasyPoints?.map((driver, index) => (
              <tr key={index} className="hover:bg-white/[0.04]">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${getPositionClass(driver.position)}`}>
                    {driver.position}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-white">
                      {driver.driverName}
                    </div>
                    <div className="text-sm text-gray-400">#{driver.driverNumber}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {driver.team}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {driver.f1Points}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${
                    driver.fantasyPoints > 0 ? 'text-green-400' :
                    driver.fantasyPoints < 0 ? 'text-red-400' : 'text-white'
                  }`}>
                    {driver.fantasyPoints}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${
                    driver.captainFantasyPoints > 0 ? 'text-green-400' :
                    driver.captainFantasyPoints < 0 ? 'text-red-400' : 'text-white'
                  }`}>
                    {driver.captainFantasyPoints}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {driver.dnf ? (
                    <span className="px-3 py-1 text-xs font-medium bg-red-500/20 text-red-400 rounded-full">
                      DNF
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">
                      Finished
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Layout title="Race Results">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-black mb-2">Race Results</h1>
            <p className="text-gray-300">Loading race data...</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 animate-pulse">
            <div className="h-8 bg-white/10 rounded w-1/3 mb-4"></div>
            <div className="h-6 bg-white/10 rounded w-1/4 mb-8"></div>
            <div className="space-y-3">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-4 bg-white/10 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Race Results">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-2">Race Results</h1>
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 max-w-md mx-auto">
            <div className="text-red-400 text-lg font-medium mb-2">Error loading race data</div>
            <p className="text-red-300">{error}</p>
            <button
              onClick={() => navigate('/races')}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-[#FF1801] to-red-600 text-white rounded-xl hover:from-red-600 hover:to-[#FF1801] transition-all font-semibold"
            >
              Back to Races
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Race Results">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <button
            onClick={() => navigate('/races')}
            className="mb-4 text-[#FF1801] hover:text-red-400 flex items-center justify-center transition-colors font-medium"
          >
            ← Back to Races
          </button>

          <h1 className="text-4xl font-black mb-2">
            {fantasyPoints?.raceName || 'Race Results'}
          </h1>
          <p className="text-gray-300">
            {fantasyPoints?.year} Season • Round {fantasyPoints?.round}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('results')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'results'
                  ? 'bg-gradient-to-r from-[#FF1801] to-red-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              Race Results
            </button>
            <button
              onClick={() => setActiveTab('fantasy')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'fantasy'
                  ? 'bg-gradient-to-r from-[#FF1801] to-red-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              Fantasy Points
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'results' && raceResults && <ResultsTable />}
          {activeTab === 'fantasy' && fantasyPoints && <FantasyPointsTable />}
        </div>
      </div>
    </Layout>
  );
}

export default RaceResults;