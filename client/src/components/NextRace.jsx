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
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 animate-pulse">
        <div className="h-6 bg-white/10 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-white/10 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-white/10 rounded w-1/4"></div>
      </div>
    );
  }

  if (error || !nextRace) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <h3 className="text-xl font-bold text-white mb-2">Next Race</h3>
        <p className="text-red-400">{error || 'No upcoming races found'}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <h3 className="text-xl font-bold text-white mb-6">Next Grand Prix</h3>

      <div className="space-y-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
          <h4 className="text-2xl font-black text-[#FF1801] mb-1">{nextRace.raceName}</h4>
          <p className="text-gray-400 text-sm">{nextRace.Circuit?.circuitName}</p>
        </div>

        <div className="space-y-3">
          {nextRace.schedule?.fp1 && (
            <div className="flex justify-between items-center p-3 rounded-xl border border-white/10 bg-white/[0.04]">
              <div>
                <p className="text-sm font-semibold text-white">Practice 1</p>
                <p className="text-xs text-gray-400">
                  {formatDate(nextRace.schedule.fp1)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-[#FF1801]">
                  {formatTime(nextRace.schedule.fp1)}
                </p>
              </div>
            </div>
          )}

          {nextRace.schedule?.qualifying && (
            <div className="flex justify-between items-center p-3 rounded-xl border border-white/10 bg-white/[0.04]">
              <div>
                <p className="text-sm font-semibold text-white">Qualifying</p>
                <p className="text-xs text-gray-400">
                  {formatDate(nextRace.schedule.qualifying)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-[#FF1801]">
                  {formatTime(nextRace.schedule.qualifying)}
                </p>
              </div>
            </div>
          )}

          {nextRace.schedule?.race && (
            <div className="flex justify-between items-center p-4 rounded-xl border border-[#FF1801]/20 bg-[#FF1801]/5">
              <div>
                <p className="text-lg font-bold text-white">🏁 Race Day</p>
                <p className="text-sm text-gray-400">
                  {formatDate(nextRace.schedule.race)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-[#FF1801]">
                  {formatTime(nextRace.schedule.race)}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Season Progress</p>
              <p className="text-lg font-bold text-white">
                Round {nextRace.round} of {nextRace.year}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-[#FF1801]">{nextRace.round}</div>
              <div className="text-xs text-gray-400">Round</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NextRace;