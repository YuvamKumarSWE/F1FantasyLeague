import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
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
    if (pos === 1) return 'text-yellow-600 font-bold';
    if (pos === 2) return 'text-gray-600 font-bold';
    if (pos === 3) return 'text-orange-600 font-bold';
    if (pos <= 10) return 'text-green-600 font-semibold';
    return 'text-gray-500';
  };

  const ResultsTable = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Race Results</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Driver
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Team
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time/Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Points
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fastest Lap
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {raceResults?.races?.results?.map((result, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${getPositionClass(result.position)}`}>
                    {result.position}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {result.driver.name} {result.driver.surname}
                    </div>
                    <div className="text-sm text-gray-500">#{result.driver.number}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {result.team.teamName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {result.retired ? 'DNF' : formatTime(result.time)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {result.points}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Fantasy Points</h3>
        <p className="text-sm text-gray-600 mt-1">
          Points calculated based on race position, bonuses, and penalties
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Driver
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Team
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                F1 Points
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fantasy Points
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Captain Points
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fantasyPoints?.driversFantasyPoints?.map((driver, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${getPositionClass(driver.position)}`}>
                    {driver.position}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {driver.driverName}
                    </div>
                    <div className="text-sm text-gray-500">#{driver.driverNumber}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {driver.team}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {driver.f1Points}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${
                    driver.fantasyPoints > 0 ? 'text-green-600' : 
                    driver.fantasyPoints < 0 ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {driver.fantasyPoints}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${
                    driver.captainFantasyPoints > 0 ? 'text-green-600' : 
                    driver.captainFantasyPoints < 0 ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {driver.captainFantasyPoints}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {driver.dnf ? (
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                      DNF
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
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
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-red-800">Error</h3>
            <p className="text-red-600 mt-2">{error}</p>
            <button
              onClick={() => navigate('/races')}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Back to Races
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/races')}
            className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
          >
            ← Back to Races
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">
            {fantasyPoints?.raceName || 'Race Results'}
          </h1>
          <p className="text-gray-600 mt-2">
            {fantasyPoints?.year} Season • Round {fantasyPoints?.round}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('results')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'results'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Race Results
              </button>
              <button
                onClick={() => setActiveTab('fantasy')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'fantasy'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Fantasy Points
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'results' && raceResults && <ResultsTable />}
        {activeTab === 'fantasy' && fantasyPoints && <FantasyPointsTable />}
      </main>
    </div>
  );
}

export default RaceResults;