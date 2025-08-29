import { useState, useEffect } from 'react';
import { driverService, fantasyTeamService } from '../services';

function TeamCreation({ nextRace, currentTeam, onTeamCreated }) {
  const [allDrivers, setAllDrivers] = useState([]);
  const [selectedDrivers, setSelectedDrivers] = useState([]);
  const [captain, setCaptain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [totalCost, setTotalCost] = useState(0);

  const TOTAL_BUDGET = 100;
  const REQUIRED_DRIVERS = 5;

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        const driversResponse = await driverService.getDrivers();
        if (driversResponse.success) {
          setAllDrivers(driversResponse.data);
        } else {
          setError('Failed to fetch drivers');
        }
      } catch (err) {
        setError('Failed to fetch drivers');
        console.error('Error fetching drivers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  useEffect(() => {
    // Calculate total cost when selected drivers change
    const cost = selectedDrivers.reduce((total, driver) => total + (driver.cost || 0), 0);
    setTotalCost(cost);
  }, [selectedDrivers]);

  const getDeadline = () => {
    if (!nextRace?.schedule?.fp1) return null;
    const fp1Date = new Date(nextRace.schedule.fp1);
    // Set to start of day (00:00 AM) to match backend logic
    fp1Date.setHours(0, 0, 0, 0);
    return fp1Date;
  };

  const isDeadlinePassed = () => {
    const deadline = getDeadline();
    if (!deadline) return false;
    return new Date() >= deadline;
  };

  const formatDeadline = () => {
    const deadline = getDeadline();
    if (!deadline) return 'Unknown';
    return deadline.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeUntilDeadline = () => {
    const deadline = getDeadline();
    if (!deadline) return 'Unknown';
    
    const now = new Date();
    const timeDiff = deadline - now;
    
    if (timeDiff <= 0) return 'Deadline passed';
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const handleDriverSelect = (driver) => {
    if (selectedDrivers.length >= REQUIRED_DRIVERS) return;
    if (selectedDrivers.find(d => d._id === driver._id)) return;
    
    const newSelectedDrivers = [...selectedDrivers, driver];
    setSelectedDrivers(newSelectedDrivers);
  };

  const handleDriverRemove = (driverId) => {
    const newSelectedDrivers = selectedDrivers.filter(d => d._id !== driverId);
    setSelectedDrivers(newSelectedDrivers);
    
    // Remove captain if the removed driver was captain
    if (captain?._id === driverId) {
      setCaptain(null);
    }
  };

  const handleCaptainSelect = (driver) => {
    setCaptain(driver);
  };

  const handleSubmit = async () => {
    if (selectedDrivers.length !== REQUIRED_DRIVERS) {
      setError(`Please select exactly ${REQUIRED_DRIVERS} drivers`);
      return;
    }

    if (totalCost > TOTAL_BUDGET) {
      setError(`Team cost ($${totalCost}M) exceeds budget ($${TOTAL_BUDGET}M)`);
      return;
    }

    if (isDeadlinePassed()) {
      setError('Team selection deadline has passed');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const teamData = {
        raceId: nextRace.raceId,
        drivers: selectedDrivers.map(d => d._id),
        captain: captain?._id || null
      };

      const response = await fantasyTeamService.createTeam(teamData);
      
      if (response.success) {
        onTeamCreated(response.data);
        // Reset form
        setSelectedDrivers([]);
        setCaptain(null);
      } else {
        setError(response.error || 'Failed to create team');
      }
    } catch (err) {
      setError('Failed to create team');
      console.error('Error creating team:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 animate-pulse">
          <div className="h-6 bg-white/10 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-white/10 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (currentTeam) {
    return (
      <div className="space-y-6">
        {/* Current Team Display */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-xl font-bold text-white mb-6">
            Your Team for {nextRace?.raceName}
          </h2>

          <div className="space-y-4">
            {currentTeam.drivers?.map((driver) => (
              <div
                key={driver._id}
                className={`flex justify-between items-center p-4 rounded-xl border transition-all ${
                  currentTeam.captain?._id === driver._id
                    ? 'border-yellow-500/20 bg-yellow-500/10'
                    : 'border-white/10 bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {currentTeam.captain?._id === driver._id && (
                    <span className="text-yellow-400 text-lg">👑</span>
                  )}
                  <div>
                    <p className="font-semibold text-white">
                      {driver.name} {driver.surname}
                    </p>
                    <p className="text-sm text-gray-400">{driver.team}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#FF1801]">${driver.cost}M</p>
                  <p className="text-sm text-gray-400">#{driver.number}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex justify-between text-lg font-bold">
              <span className="text-gray-400">Total Cost:</span>
              <span className="text-white">${currentTeam.drivers?.reduce((total, driver) => total + (driver.cost || 0), 0)}M</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Deadline Section */}
      <div className={`rounded-2xl border p-6 ${
        isDeadlinePassed()
          ? 'border-red-500/20 bg-red-500/10'
          : 'border-[#FF1801]/20 bg-[#FF1801]/10'
      }`}>
        <h2 className="text-xl font-bold mb-3 text-white">
          Team Selection Deadline
        </h2>
        <p className="text-sm text-gray-400 mb-2">
          {nextRace?.raceName} - Practice 1 Session
        </p>
        <p className="font-semibold text-white">{formatDeadline()}</p>
        <p className={`text-sm mt-2 font-medium ${
          isDeadlinePassed() ? 'text-red-400' : 'text-[#FF1801]'
        }`}>
          {isDeadlinePassed() ? '⏰ Deadline has passed' : `⏳ Time remaining: ${getTimeUntilDeadline()}`}
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
          <p className="text-red-400 font-medium">{error}</p>
        </div>
      )}

      {!isDeadlinePassed() && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Drivers */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <h3 className="text-xl font-bold text-white mb-6">
              Available Drivers
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {allDrivers
                .filter(driver => !selectedDrivers.find(d => d._id === driver._id))
                .map((driver) => (
                  <div
                    key={driver._id}
                    className="p-4 rounded-xl border border-white/10 bg-white/[0.04] cursor-pointer transition-all hover:border-[#FF1801]/30 hover:bg-[#FF1801]/5"
                    onClick={() => handleDriverSelect(driver)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-white">
                          {driver.name} {driver.surname}
                        </p>
                        <p className="text-sm text-gray-400">{driver.team}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#FF1801]">${driver.cost}M</p>
                        <p className="text-sm text-gray-400">#{driver.number}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Selected Team */}
          <div className="space-y-6">
            {/* Selected Drivers */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <h3 className="text-xl font-bold text-white mb-6">
                Your Team ({selectedDrivers.length}/{REQUIRED_DRIVERS})
              </h3>

              <div className="space-y-3 min-h-[200px]">
                {selectedDrivers.map((driver) => (
                  <div
                    key={driver._id}
                    className={`p-4 rounded-xl border transition-all ${
                      captain?._id === driver._id
                        ? 'border-yellow-500/20 bg-yellow-500/10'
                        : 'border-white/10 bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        {captain?._id === driver._id && (
                          <span className="text-yellow-400 text-lg">👑</span>
                        )}
                        <div>
                          <p className="font-semibold text-white">
                            {driver.name} {driver.surname}
                          </p>
                          <p className="text-sm text-gray-400">{driver.team}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className="font-bold text-[#FF1801]">${driver.cost}M</p>
                          <p className="text-sm text-gray-400">#{driver.number}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCaptainSelect(driver);
                          }}
                          className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${
                            captain?._id === driver._id
                              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                              : 'bg-white/10 text-gray-400 hover:bg-yellow-500/20 hover:text-yellow-400 border border-white/10'
                          }`}
                          disabled={isDeadlinePassed()}
                        >
                          {captain?._id === driver._id ? 'Captain' : 'Make Captain'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDriverRemove(driver._id);
                          }}
                          className="text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-red-500/10 transition-all"
                          disabled={isDeadlinePassed()}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget Summary */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <h3 className="text-xl font-bold text-white mb-6">Budget Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-xl border border-white/10 bg-white/[0.04]">
                  <span className="text-gray-400">Total Budget:</span>
                  <span className="font-bold text-white">${TOTAL_BUDGET}M</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl border border-white/10 bg-white/[0.04]">
                  <span className="text-gray-400">Spent:</span>
                  <span className="font-bold text-[#FF1801]">${totalCost}M</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl border border-white/10 bg-white/[0.04]">
                  <span className="text-gray-400">Remaining:</span>
                  <span className={`font-bold ${
                    totalCost > TOTAL_BUDGET ? 'text-red-400' : 'text-green-400'
                  }`}>
                    ${TOTAL_BUDGET - totalCost}M
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="w-full bg-white/10 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      totalCost > TOTAL_BUDGET ? 'bg-red-500' : 'bg-gradient-to-r from-[#FF1801] to-red-600'
                    }`}
                    style={{ width: `${Math.min((totalCost / TOTAL_BUDGET) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>0</span>
                  <span>${TOTAL_BUDGET}M</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={
                selectedDrivers.length !== REQUIRED_DRIVERS ||
                totalCost > TOTAL_BUDGET ||
                isDeadlinePassed() ||
                submitting
              }
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                selectedDrivers.length === REQUIRED_DRIVERS &&
                totalCost <= TOTAL_BUDGET &&
                !isDeadlinePassed() &&
                !submitting
                  ? 'bg-gradient-to-r from-[#FF1801] to-red-600 text-white hover:from-red-600 hover:to-[#FF1801] hover:shadow-lg hover:shadow-[#FF1801]/25 transform hover:scale-105'
                  : 'bg-white/10 text-gray-500 cursor-not-allowed'
              }`}
            >
              {submitting ? '🏁 Creating Team...' : '🏎️ Create Team'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamCreation;
