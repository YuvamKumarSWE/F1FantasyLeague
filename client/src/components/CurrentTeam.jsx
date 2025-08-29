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
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 h-full">
        <h2 className="text-xl font-bold text-white mb-6">
          Current F1 Team for Next Race
        </h2>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-white/10 rounded w-3/4"></div>
          <div className="h-4 bg-white/10 rounded w-1/2"></div>
          <div className="h-4 bg-white/10 rounded w-2/3"></div>
          <div className="h-4 bg-white/10 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 h-full">
        <h2 className="text-xl font-bold text-white mb-6">
          Current F1 Team for Next Race
        </h2>
        <div className="text-red-400 text-sm">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!currentTeam) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 h-full">
        <h2 className="text-xl font-bold text-white mb-6">
          Current F1 Team for Next Race
        </h2>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🏎️</div>
          <h3 className="text-lg font-semibold text-white mb-2">No Team Created</h3>
          <p className="text-gray-400 mb-6">
            You haven't created a team for {nextRace?.raceName} yet.
          </p>
          <a
            href="/fantasy-team"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF1801] to-red-600 font-semibold text-white hover:from-red-600 hover:to-[#FF1801] transition-all duration-300 hover:shadow-lg hover:shadow-[#FF1801]/25"
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
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 h-full">
      <h2 className="text-xl font-bold text-white mb-6">
        Current F1 Team for Next Race
      </h2>

      {nextRace && (
        <div className="mb-6 rounded-xl border border-[#FF1801]/20 bg-[#FF1801]/5 p-4">
          <p className="text-sm text-[#FF1801] font-medium">
            🏁 Next Race: {nextRace.raceName}
          </p>
          <p className="text-sm text-red-400">
            {new Date(nextRace.schedule?.race).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Drivers</h3>
          <div className="space-y-3">
            {currentTeam.drivers?.map((driver) => (
              <div key={driver._id} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-[#FF1801] font-bold text-sm">#{driver.number}</span>
                    <div>
                      <span className="font-semibold text-white">
                        {driver.name} {driver.surname}
                      </span>
                      {currentTeam.captain && currentTeam.captain._id === driver._id && (
                        <div className="flex items-center mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
                            👑 Captain
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-gray-400 font-medium">{formatCurrency(driver.cost)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-400">Total Cost:</span>
              <span className="font-bold text-white">{formatCurrency(totalCost)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Budget Remaining:</span>
              <span className={`font-semibold ${
                budgetRemaining >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {formatCurrency(budgetRemaining)}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <a
            href="/fantasy-team"
            className="w-full bg-gradient-to-r from-[#FF1801] to-red-600 text-white px-4 py-3 rounded-xl hover:from-red-600 hover:to-[#FF1801] transition-all duration-300 font-semibold text-center block hover:shadow-lg hover:shadow-[#FF1801]/25"
          >
            Manage Team
          </a>
        </div>
      </div>
    </div>
  );
}

export default CurrentTeam;
