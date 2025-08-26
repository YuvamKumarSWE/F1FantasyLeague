import { useState, useEffect } from 'react';
import { fantasyTeamService } from '../services/fantasyTeamService';
import { raceService } from '../services/raceService';

function CurrentTeam() {
  const [currentTeam, setCurrentTeam] = useState(null);
  const [nextRace, setNextRace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentTeam = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get next race first
        const nextRaceResponse = await raceService.getNextRace();
        if (nextRaceResponse.success) {
          setNextRace(nextRaceResponse.data);
          
          // Try to get user's team for the next race
          const teamResponse = await fantasyTeamService.getTeam(nextRaceResponse.data.raceId);
          if (teamResponse.success) {
            setCurrentTeam(teamResponse.data);
          }
        } else {
          setError('Failed to fetch next race information');
        }
      } catch {
        setError('Failed to fetch team data');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentTeam();
  }, []);

  const calculateTotalCost = (drivers) => {
    if (!drivers || !Array.isArray(drivers)) return 0;
    return drivers.reduce((total, driver) => total + (driver.cost || 0), 0);
  };

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(1)}M`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 h-full">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Current F1 Team for Next Race
        </h2>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6 h-full">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Current F1 Team for Next Race
        </h2>
        <div className="text-red-600 text-sm">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!currentTeam) {
    return (
      <div className="bg-white rounded-lg shadow p-6 h-full">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Current F1 Team for Next Race
        </h2>
        <div className="text-center py-8">
          <div className="text-gray-500 mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Team Created</h3>
          <p className="text-gray-600 mb-4">
            You haven't created a team for {nextRace?.raceName} yet.
          </p>
          <a 
            href="/fantasy-team" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Team
          </a>
        </div>
      </div>
    );
  }

  const totalCost = calculateTotalCost(currentTeam.drivers);
  const budgetRemaining = 100 - totalCost;

  return (
    <div className="bg-white rounded-lg shadow p-6 h-full">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Current F1 Team for Next Race
      </h2>
      
      {nextRace && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Next Race:</strong> {nextRace.raceName}
          </p>
          <p className="text-sm text-blue-600">
            {new Date(nextRace.schedule?.race).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>
      )}

      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Drivers</h3>
          <div className="space-y-2">
            {currentTeam.drivers?.map((driver) => (
              <div key={driver._id} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">#{driver.number}</span>
                  <span className="font-medium">
                    {driver.name} {driver.surname}
                  </span>
                  {currentTeam.captain && currentTeam.captain._id === driver._id && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                      👑 Captain
                    </span>
                  )}
                </div>
                <span className="text-gray-500">{formatCurrency(driver.cost)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-700">Total Cost:</span>
            <span className="font-semibold">{formatCurrency(totalCost)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>Budget Remaining:</span>
            <span className={budgetRemaining >= 0 ? 'text-green-600' : 'text-red-600'}>
              {formatCurrency(budgetRemaining)}
            </span>
          </div>
        </div>

        <div className="pt-3">
          <a 
            href="/fantasy-team" 
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-center block text-sm font-medium"
          >
            Manage Team
          </a>
        </div>
      </div>
    </div>
  );
}

export default CurrentTeam;
