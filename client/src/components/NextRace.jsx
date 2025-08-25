import { useState, useEffect } from 'react';
import { raceService } from '../services';

function NextRace() {
  const [nextRace, setNextRace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNextRace = async () => {
      try {
        setLoading(true);
        const response = await raceService.getNextRace();
        if (response.success && response.data) {
          setNextRace(response.data);
        }
      } catch (err) {
        setError('Failed to fetch next race');
        console.error('Error fetching next race:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNextRace();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  if (error || !nextRace) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Next Race</h3>
        <p className="text-red-600">{error || 'No upcoming races found'}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Race</h3>
      
      <div className="space-y-3">
        <div>
          <h4 className="text-xl font-bold text-blue-600">{nextRace.raceName}</h4>
          <p className="text-gray-600">{nextRace.Circuit?.circuitName}</p>
          <p className="text-sm text-gray-500">{nextRace.Circuit?.Location?.locality}, {nextRace.Circuit?.Location?.country}</p>
        </div>
        
        <div className="border-t pt-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {nextRace.schedule?.fp1 && (
              <div>
                <p className="text-sm font-medium text-gray-700">Practice 1</p>
                <p className="text-sm text-gray-600">
                  {formatDate(nextRace.schedule.fp1)}
                </p>
                <p className="text-sm text-gray-600">
                  {formatTime(nextRace.schedule.fp1)}
                </p>
              </div>
            )}
            
            {nextRace.schedule?.qualifying && (
              <div>
                <p className="text-sm font-medium text-gray-700">Qualifying</p>
                <p className="text-sm text-gray-600">
                  {formatDate(nextRace.schedule.qualifying)}
                </p>
                <p className="text-sm text-gray-600">
                  {formatTime(nextRace.schedule.qualifying)}
                </p>
              </div>
            )}
            
            {nextRace.schedule?.race && (
              <div className="sm:col-span-2">
                <p className="text-sm font-medium text-gray-700">Race</p>
                <p className="text-lg font-semibold text-red-600">
                  {formatDate(nextRace.schedule.race)}
                </p>
                <p className="text-sm text-gray-600">
                  {formatTime(nextRace.schedule.race)}
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-3 mt-4">
          <p className="text-sm text-blue-800">
            Round {nextRace.round} of {nextRace.year} Season
          </p>
        </div>
      </div>
    </div>
  );
}

export default NextRace;