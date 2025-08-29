import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import TeamCreation from '../components/TeamCreation';
import PastTeams from '../components/PastTeams';
import ScoringRules from '../components/ScoringRules';
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
      <Layout title="Fantasy Team">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-black mb-2">Fantasy Team</h1>
            <p className="text-gray-300">Loading your team data...</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 animate-pulse">
            <div className="h-8 bg-white/10 rounded w-1/3 mb-4"></div>
            <div className="h-6 bg-white/10 rounded w-1/4 mb-8"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-white/10 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Fantasy Team">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-2">Fantasy Team</h1>
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 max-w-md mx-auto">
            <div className="text-red-400 text-lg font-medium mb-2">Error loading team data</div>
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Fantasy Team">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-black mb-2">Fantasy Team</h1>
          <p className="text-gray-300">Create and manage your F1 fantasy teams</p>
        </div>

        {/* Tab Navigation */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('creation')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'creation'
                  ? 'bg-gradient-to-r from-[#FF1801] to-red-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              Team Creation
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'past'
                  ? 'bg-gradient-to-r from-[#FF1801] to-red-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              Past Teams
            </button>
            <button
              onClick={() => setActiveTab('scoring')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'scoring'
                  ? 'bg-gradient-to-r from-[#FF1801] to-red-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              Scoring Rules
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          {activeTab === 'creation' && (
            <TeamCreation
              nextRace={nextRace}
              currentTeam={currentTeam}
              onTeamCreated={handleTeamCreated}
            />
          )}
          {activeTab === 'past' && <PastTeams />}
          {activeTab === 'scoring' && <ScoringRules />}
        </div>
      </div>
    </Layout>
  );
}

export default FantasyTeam;
