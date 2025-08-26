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
    return new Date(nextRace.schedule.fp1);
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
        <div className="bg-white rounded-lg shadow p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
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
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Your Team for {nextRace?.raceName}
          </h2>
          
          <div className="space-y-4">
            {currentTeam.drivers?.map((driver) => (
              <div 
                key={driver._id} 
                className={`flex justify-between items-center p-4 rounded-lg border ${
                  currentTeam.captain?._id === driver._id 
                    ? 'border-yellow-400 bg-yellow-50' 
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {currentTeam.captain?._id === driver._id && (
                    <span className="text-yellow-500 text-lg">👑</span>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {driver.name} {driver.surname}
                    </p>
                    <p className="text-sm text-gray-500">{driver.team}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${driver.cost}M</p>
                  <p className="text-sm text-gray-500">#{driver.number}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Cost:</span>
              <span>${currentTeam.drivers?.reduce((total, driver) => total + (driver.cost || 0), 0)}M</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Deadline Section */}
      <div className={`rounded-lg shadow p-6 ${
        isDeadlinePassed() ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'
      }`}>
        <h2 className="text-lg font-semibold mb-2">
          Team Selection Deadline
        </h2>
        <p className="text-sm text-gray-600 mb-2">
          {nextRace?.raceName} - Practice 1 Session
        </p>
        <p className="font-medium">{formatDeadline()}</p>
        <p className={`text-sm mt-1 ${
          isDeadlinePassed() ? 'text-red-600' : 'text-blue-600'
        }`}>
          {isDeadlinePassed() ? 'Deadline has passed' : `Time remaining: ${getTimeUntilDeadline()}`}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!isDeadlinePassed() && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Drivers */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Available Drivers
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {allDrivers
                .filter(driver => !selectedDrivers.find(d => d._id === driver._id))
                .map((driver) => (
                  <div
                    key={driver._id}
                    className="p-3 rounded-lg border cursor-pointer transition-all border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"
                    onClick={() => handleDriverSelect(driver)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">
                          {driver.name} {driver.surname}
                        </p>
                        <p className="text-sm text-gray-500">{driver.team}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${driver.cost}M</p>
                        <p className="text-sm text-gray-500">#{driver.number}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Selected Team */}
          <div className="space-y-6">
            {/* Selected Drivers */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Team ({selectedDrivers.length}/{REQUIRED_DRIVERS})
              </h3>
              
              <div className="space-y-2 min-h-[200px]">
                {selectedDrivers.map((driver) => (
                  <div
                    key={driver._id}
                    className={`p-3 rounded-lg border transition-all ${
                      captain?._id === driver._id 
                        ? 'border-yellow-400 bg-yellow-50' 
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        {captain?._id === driver._id && (
                          <span className="text-yellow-500">👑</span>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {driver.name} {driver.surname}
                          </p>
                          <p className="text-sm text-gray-500">{driver.team}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <p className="font-medium text-gray-900">${driver.cost}M</p>
                          <p className="text-sm text-gray-500">#{driver.number}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCaptainSelect(driver);
                          }}
                          className={`px-2 py-1 text-xs rounded ${
                            captain?._id === driver._id
                              ? 'bg-yellow-200 text-yellow-800'
                              : 'bg-gray-200 text-gray-600 hover:bg-yellow-200'
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
                          className="text-red-500 hover:text-red-700"
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
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Budget:</span>
                  <span className="font-medium">${TOTAL_BUDGET}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Spent:</span>
                  <span className="font-medium">${totalCost}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining:</span>
                  <span className={`font-medium ${
                    totalCost > TOTAL_BUDGET ? 'text-red-600' : 'text-green-600'
                  }`}>
                    ${TOTAL_BUDGET - totalCost}M
                  </span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${
                      totalCost > TOTAL_BUDGET ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min((totalCost / TOTAL_BUDGET) * 100, 100)}%` }}
                  ></div>
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
              className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                selectedDrivers.length === REQUIRED_DRIVERS && 
                totalCost <= TOTAL_BUDGET && 
                !isDeadlinePassed() && 
                !submitting
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {submitting ? 'Creating Team...' : 'Create Team'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamCreation;
