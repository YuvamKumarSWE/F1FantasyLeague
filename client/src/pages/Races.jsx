import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import NextRace from '../components/NextRace';
import { raceService } from '../services';

function Races() {
  const navigate = useNavigate();
  const [allRaces, setAllRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        setLoading(true);

        // Fetch all race data
        const allRacesResponse = await raceService.getRaces('2025');

        if (allRacesResponse.success) {
          setAllRaces(allRacesResponse.data);
        }
      } catch (err) {
        setError('Failed to fetch race data');
        console.error('Error fetching races:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRaces();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const getRaceStatus = (race) => {
    const now = new Date();
    const raceDate = race.schedule?.race ? new Date(race.schedule.race) : null;
    const fp1Date = race.schedule?.fp1 ? new Date(race.schedule.fp1) : null;

    if (raceDate && raceDate < now) {
      return { status: 'completed', label: 'Completed', color: 'bg-green-500/20 text-green-400' };
    } else if (fp1Date && fp1Date <= now) {
      return { status: 'current', label: 'In Progress', color: 'bg-yellow-500/20 text-yellow-400' };
    } else {
      return { status: 'upcoming', label: 'Upcoming', color: 'bg-blue-500/20 text-blue-400' };
    }
  };

  const RaceCard = ({ race }) => {
    const raceStatus = getRaceStatus(race);

    return (
      <div className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 hover:bg-white/[0.08] transition-all duration-300 hover:scale-105">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold group-hover:text-[#FF1801] transition-colors">{race.raceName}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${raceStatus.color}`}>
            {raceStatus.label}
          </span>
        </div>

        <div className="space-y-3 text-sm mb-6">
          <div className="flex justify-between">
            <span className="text-gray-400">Circuit:</span>
            <span className="text-white">{race.circuit?.circuitName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Location:</span>
            <span className="text-white">{race.circuit?.city}, {race.circuit?.country}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Round:</span>
            <span className="text-white font-semibold">{race.round}</span>
          </div>
          {race.schedule?.race && (
            <div className="flex justify-between">
              <span className="text-gray-400">Race Date:</span>
              <span className="text-white font-semibold">{formatDate(race.schedule.race)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-400">Laps:</span>
            <span className="text-white">{race.laps}</span>
          </div>

          {/* Additional info for completed races */}
          {raceStatus.status === 'completed' && race.winner && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400">🏆</span>
                  <span className="text-white font-semibold">Winner: {race.winner.name} {race.winner.surname}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Team:</span>
                  <span className="text-white">{race.teamWinner?.teamName}</span>
                </div>
                {race.fastLap && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fastest Lap:</span>
                    <span className="text-white">{race.fastLap.time} ({race.fastLap.driverId.toUpperCase()})</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {raceStatus.status === 'completed' && (
          <button
            onClick={() => navigate(`/races/${race.raceId}/results`)}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF1801] to-red-600 text-white hover:from-red-600 hover:to-[#FF1801] transition-all font-semibold"
          >
            View Full Results
          </button>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <Layout title="Race Calendar">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-black mb-2">Race Calendar</h1>
            <p className="text-gray-300">Loading 2025 season schedule...</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 animate-pulse">
                <div className="h-6 bg-white/10 rounded w-3/4 mb-4"></div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-white/10 rounded w-full"></div>
                  <div className="h-4 bg-white/10 rounded w-2/3"></div>
                </div>
                <div className="h-10 bg-white/10 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Race Calendar">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-2">Race Calendar</h1>
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 max-w-md mx-auto">
            <div className="text-red-400 text-lg font-medium mb-2">Error loading races</div>
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Calculate completed races for progress bar
  const completedRaces = allRaces.filter(race => {
    const now = new Date();
    const raceDate = race.schedule?.race ? new Date(race.schedule.race) : null;
    return raceDate && raceDate < now;
  });

  return (
    <Layout title="Race Calendar">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-black mb-2">Grand Prix Calendar</h1>
          <p className="text-gray-300">Complete 2025 Formula 1 season schedule</p>
        </div>

        {/* Next Race Section */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <NextRace />
        </div>

        {/* Section Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">All Races</h2>
            <p className="text-gray-400 mt-1">Track the entire championship</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#FF1801]">{allRaces.length}</div>
            <div className="text-sm text-gray-400">Total Races</div>
          </div>
        </div>

        {/* Race Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allRaces.map((race, index) => (
            <RaceCard key={race.raceId || index} race={race} />
          ))}
        </div>

        {/* Season Progress */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Season Progress</h2>
          <div className="w-full bg-white/10 rounded-full h-4 mb-4">
            <div
              className="bg-gradient-to-r from-[#FF1801] to-red-600 h-4 rounded-full transition-all duration-500"
              style={{
                width: `${allRaces.length > 0 ? (completedRaces.length / allRaces.length) * 100 : 0}%`
              }}
            ></div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-white">
              {completedRaces.length} of {allRaces.length} races completed
            </div>
            <div className="text-sm text-gray-400 mt-1">
              {Math.round((completedRaces.length / allRaces.length) * 100)}% of season complete
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Races;
