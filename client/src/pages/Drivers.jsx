import { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import { driverService } from '../services/driverService';

const DriversPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Fetch drivers function
  const fetchDrivers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call the service with parameters
      const result = await driverService.getAllDrivers({
        sortBy,
        sortOrder
      });
      
      if (result.success) {
        setDrivers(result.data);
      } else {
        setError(result.message || 'Failed to fetch drivers');
      }
    } catch (err) {
      console.error('Error fetching drivers:', err);
      setError(err.response?.data?.message || 'Failed to fetch drivers');
    } finally {
      setLoading(false);
    }
  }, [sortBy, sortOrder]);

  // Fetch drivers when component mounts or sort options change
  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  if (loading) {
    return (
      <Layout title="F1 Drivers">
        <div className="flex items-center justify-center h-64">
          <div className="text-xl text-gray-300">Loading drivers...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="F1 Drivers">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-xl text-red-400 mb-2">Error loading drivers</div>
            <div className="text-gray-400">{error}</div>
            <button
              onClick={fetchDrivers}
              className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF1801] to-red-600 text-white hover:from-red-600 hover:to-[#FF1801] transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="F1 Drivers">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black mb-2">Elite Drivers</h1>
            <p className="text-gray-300">Discover the world's fastest racing drivers</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#FF1801]">{drivers.length}</div>
            <div className="text-sm text-gray-400">Total Drivers</div>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <h3 className="text-lg font-semibold mb-4">Filter & Sort</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-[#FF1801] focus:outline-none focus:ring-1 focus:ring-[#FF1801] transition-colors"
              >
                <option value="name">Name</option>
                <option value="surname">Surname</option>
                <option value="number">Number</option>
                <option value="teamId">Team</option>
                <option value="nationality">Nationality</option>
                <option value="driverId">Driver ID</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Order
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-[#FF1801] focus:outline-none focus:ring-1 focus:ring-[#FF1801] transition-colors"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Drivers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {drivers.map((driver) => (
            <div key={driver._id} className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 hover:bg-white/[0.08] transition-all duration-300 hover:scale-105">
              <div className="text-center mb-4">
                <div className="inline-flex h-16 w-16 rounded-full bg-gradient-to-br from-[#FF1801] to-red-600 items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-lg">#{driver.number}</span>
                </div>
                <h3 className="text-xl font-bold mb-1 group-hover:text-[#FF1801] transition-colors">
                  {driver.name} {driver.surname}
                </h3>
                <p className="text-gray-400 text-sm">
                  {driver.teamId}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Cost:</span>
                  <span className="font-bold text-green-400">${driver.cost}M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Code:</span>
                  <span className="font-semibold text-[#FF1801]">{driver.shortName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Nationality:</span>
                  <span className="font-semibold">{driver.nationality}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default DriversPage;
