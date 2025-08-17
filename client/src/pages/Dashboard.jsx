import Navbar from '../components/Navbar';
import UserRankCard from '../components/UserRankCard';

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
          {/* Current F1 Team - Full height left column */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6 h-full">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Current F1 Team for Next Race
            </h2>
            <div className="space-y-3">
              <div className="text-gray-600">
                <p><strong>Driver 1:</strong> Max Verstappen</p>
                <p><strong>Driver 2:</strong> Lewis Hamilton</p>
                <p><strong>Constructor:</strong> Red Bull Racing</p>
                <p><strong>Budget Remaining:</strong> $5.2M</p>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Edit Team
              </button>
            </div>
          </div>
          
          {/* Right column with two equal height sections */}
          <div className="flex flex-col gap-6 h-full">
            {/* User Stats - Using UserRankCard */}
            <div className="dashboard-rank-card flex-1">
              <UserRankCard />
            </div>
            
            {/* Next Race Details */}
            <div className="bg-white rounded-lg shadow p-6 flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Next Race
              </h2>
              <div className="space-y-2 text-gray-600">
                <p><strong>Race:</strong> Belgian Grand Prix</p>
                <p><strong>Circuit:</strong> Spa-Francorchamps</p>
                <p><strong>Date:</strong> August 25, 2025</p>
                <p><strong>Time:</strong> 15:00 CET</p>
                <p><strong>Weather:</strong> Partly Cloudy</p>
              </div>
              <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                View Details
              </button>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .dashboard-rank-card > div {
          background: white !important;
          border: 1px solid #e5e7eb !important;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06) !important;
          height: 100%;
        }
        
        .dashboard-rank-card h3 {
          font-size: 1.125rem !important;
          margin-bottom: 1rem !important;
        }
        
        .dashboard-rank-card .grid {
          grid-template-columns: 1fr !important;
          gap: 1rem !important;
        }
        
        .dashboard-rank-card .bg-white {
          background: #f9fafb !important;
          border: 1px solid #e5e7eb !important;
          padding: 0.75rem !important;
        }
        
        .dashboard-rank-card p {
          margin: 0 !important;
        }
        
        .dashboard-rank-card .text-2xl {
          font-size: 1.5rem !important;
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
