import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TeamCreation from '../components/TeamCreation';
import PastTeams from '../components/PastTeams';
import { raceService, fantasyTeamService } from '../services';

function FantasyTeam() {
  const [activeTab, setActiveTab] = useState('creation');
  const [nextRace, setNextRace] = useState(null);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get next race
        const nextRaceResponse = await raceService.getNextRace();
        if (nextRaceResponse.success) {
          setNextRace(nextRaceResponse.data);
          
          // Check if user already has a team for the next race
          const teamResponse = await fantasyTeamService.getTeam(nextRaceResponse.data.raceId);
          if (teamResponse.success) {
            setCurrentTeam(teamResponse.data);
          }
        }
        
      } catch (err) {
        setError('Failed to fetch race data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTeamCreated = (newTeam) => {
    setCurrentTeam(newTeam);
  };

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
                {[...Array(5)].map((_, i) => (
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
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Fantasy Team</h1>
        
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('creation')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'creation'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Team Creation
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'past'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Past Teams
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'creation' && (
          <TeamCreation 
            nextRace={nextRace} 
            currentTeam={currentTeam}
            onTeamCreated={handleTeamCreated}
          />
        )}
        {activeTab === 'past' && <PastTeams />}
      </main>
    </div>
  );
}

export default FantasyTeam;
