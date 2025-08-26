import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
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
      return { status: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' };
    } else if (fp1Date && fp1Date <= now) {
      return { status: 'current', label: 'In Progress', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { status: 'upcoming', label: 'Upcoming', color: 'bg-blue-100 text-blue-800' };
    }
  };

  const RaceCard = ({ race }) => {
    const raceStatus = getRaceStatus(race);
    
    return (
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{race.raceName}</h3>
          <span className={`px-2 py-1 rounded text-xs font-medium ${raceStatus.color}`}>
            {raceStatus.label}
          </span>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <p><strong>Circuit:</strong> {race.circuit?.circuitName}</p>
          <p><strong>Location:</strong> {race.circuit?.city}, {race.circuit?.country}</p>
          <p><strong>Round:</strong> {race.round}</p>
          {race.schedule?.race && (
            <p><strong>Race Date:</strong> {formatDate(race.schedule.race)}</p>
          )}
          <p><strong>Laps:</strong> {race.laps}</p>
          
          {/* Additional info for completed races */}
          {raceStatus.status === 'completed' && race.winner && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-500">🏆</span>
                  <span><strong>Winner:</strong> {race.winner.name} {race.winner.surname}</span>
                </div>
                <p><strong>Team:</strong> {race.teamWinner?.teamName}</p>
                {race.fastLap && (
                  <p><strong>Fastest Lap:</strong> {race.fastLap.time} ({race.fastLap.driverId.toUpperCase()})</p>
                )}
              </div>
            </div>
          )}
        </div>
        
        {raceStatus.status === 'completed' && (
          <button 
            onClick={() => navigate(`/races/${race.raceId}/results`)}
            className="w-full py-2 px-4 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            View Full Results
          </button>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Race Calendar</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Race Calendar</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  // Calculate completed races for progress bar
  const completedRaces = allRaces.filter(race => {
    const now = new Date();
    const raceDate = race.schedule?.race ? new Date(race.schedule.race) : null;
    return raceDate && raceDate < now;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Race Calendar</h1>
        
        {/* Next Race Section */}
        <div className="mb-8">
          <NextRace />
        </div>

        {/* Section Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            All Races ({allRaces.length})
          </h2>
          <p className="text-gray-600 mt-1">Complete 2025 Formula 1 season calendar</p>
        </div>

        {/* Race Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {allRaces.map((race, index) => (
            <RaceCard key={race.raceId || index} race={race} />
          ))}
        </div>

        {/* Season Progress */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Season Progress</h2>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
              style={{ 
                width: `${allRaces.length > 0 ? (completedRaces.length / allRaces.length) * 100 : 0}%` 
              }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            {completedRaces.length} of {allRaces.length} races completed
          </p>
        </div>
      </main>
    </div>
  );
}

export default Races;
