import { useState, useEffect } from 'react';
import { fantasyTeamService } from '../services';

function PastTeams() {
  const [pastTeams, setPastTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPastTeams = async () => {
      try {
        setLoading(true);
        const response = await fantasyTeamService.getUserTeams();
        
        if (response.success) {
          setPastTeams(response.data);
        } else {
          setError(response.error || 'Failed to fetch past teams');
        }
      } catch (err) {
        setError('Failed to fetch past teams');
        console.error('Error fetching past teams:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPastTeams();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateTotalCost = (drivers) => {
    return drivers?.reduce((total, driver) => total + (driver.cost || 0), 0) || 0;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 animate-pulse">
            <div className="h-6 bg-white/10 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="h-4 bg-white/10 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
        <h3 className="text-lg font-semibold text-red-400">Error</h3>
        <p className="text-red-300 mt-2">{error}</p>
      </div>
    );
  }

  if (pastTeams.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center">
        <div className="text-6xl mb-4">🏎️</div>
        <h3 className="text-xl font-semibold text-white mb-2">No Teams Yet</h3>
        <p className="text-gray-400">
          You haven't created any fantasy teams yet. Create your first team to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">
          Your Fantasy Teams ({pastTeams.length})
        </h2>
        <div className="text-sm text-gray-400">
          Total Points: {pastTeams.reduce((total, team) => total + team.points, 0)}
        </div>
      </div>

      <div className="grid gap-6">
        {pastTeams.map((team) => (
          <div key={team._id} className="rounded-2xl border border-white/10 bg-white/[0.04]">
            {/* Team Header */}
            <div className="px-6 py-4 border-b border-white/10">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {team.race?.raceName || 'Unknown Race'}
                  </h3>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                    <span>Round {team.race?.round}</span>
                    <span>{team.race?.year}</span>
                    <span>Created: {formatDate(team.createdAt)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-[#FF1801]">
                    {team.points} pts
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    {team.locked && (
                      <span className="px-3 py-1 text-xs font-medium bg-red-500/20 text-red-400 rounded-full">
                        Locked
                      </span>
                    )}
                    <span className="text-sm text-gray-400">
                      ${calculateTotalCost(team.drivers)}M spent
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Details */}
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {team.drivers?.map((driver) => (
                  <div
                    key={driver._id}
                    className={`p-4 rounded-xl border transition-all ${
                      team.captain?._id === driver._id
                        ? 'border-yellow-500/20 bg-yellow-500/10'
                        : 'border-white/10 bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {team.captain?._id === driver._id && (
                          <span className="text-yellow-400 text-lg">👑</span>
                        )}
                        <div>
                          <p className="font-semibold text-white text-sm">
                            {driver.name} {driver.surname}
                          </p>
                          <p className="text-xs text-gray-400">{driver.team}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-[#FF1801]">
                          ${driver.cost}M
                        </p>
                        <p className="text-xs text-gray-400">#{driver.number}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Team Summary */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex justify-between items-center p-3 rounded-xl border border-white/10 bg-white/[0.04]">
                    <span className="text-gray-400">Total Cost:</span>
                    <span className="font-semibold text-white">${calculateTotalCost(team.drivers)}M</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl border border-white/10 bg-white/[0.04]">
                    <span className="text-gray-400">Captain:</span>
                    <span className="font-semibold text-white">
                      {team.captain ? `${team.captain.name} ${team.captain.surname}` : 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl border border-white/10 bg-white/[0.04]">
                    <span className="text-gray-400">Race Circuit:</span>
                    <span className="font-semibold text-white">
                      {team.race?.circuit?.circuitName || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <h3 className="text-xl font-bold text-white mb-6">Season Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 rounded-xl border border-white/10 bg-white/[0.04]">
            <div className="text-3xl font-black text-[#FF1801] mb-1">
              {pastTeams.length}
            </div>
            <div className="text-sm text-gray-400">Teams Created</div>
          </div>
          <div className="text-center p-4 rounded-xl border border-white/10 bg-white/[0.04]">
            <div className="text-3xl font-black text-green-400 mb-1">
              {pastTeams.reduce((total, team) => total + team.points, 0)}
            </div>
            <div className="text-sm text-gray-400">Total Points</div>
          </div>
          <div className="text-center p-4 rounded-xl border border-white/10 bg-white/[0.04]">
            <div className="text-3xl font-black text-blue-400 mb-1">
              {pastTeams.length > 0
                ? Math.round(pastTeams.reduce((total, team) => total + team.points, 0) / pastTeams.length)
                : 0
              }
            </div>
            <div className="text-sm text-gray-400">Avg Points/Team</div>
          </div>
          <div className="text-center p-4 rounded-xl border border-white/10 bg-white/[0.04]">
            <div className="text-3xl font-black text-yellow-400 mb-1">
              {Math.max(...pastTeams.map(team => team.points), 0)}
            </div>
            <div className="text-sm text-gray-400">Best Performance</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PastTeams;
