import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { driverService } from '../services/driverService';

const DriversPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Fetch drivers function
  const fetchDrivers = async () => {
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
  };

  // Fetch drivers when component mounts or sort options change
  useEffect(() => {
    fetchDrivers();
  }, [sortBy, sortOrder]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-xl text-gray-600">Loading drivers...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-xl text-red-600 mb-2">Error loading drivers</div>
            <div className="text-gray-600">{error}</div>
            <button 
              onClick={fetchDrivers}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">F1 Drivers</h1>
          <div className="text-sm text-gray-500">
            {drivers.length} drivers available
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Drivers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {drivers.map((driver) => (
            <div key={driver._id} className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {driver.name} {driver.surname}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {driver.teamId} • #{driver.number}
              </p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-500">Cost:</span>
                <span className="font-semibold text-green-600">${driver.cost}M</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Short Name:</span>
                <span className="font-semibold">{driver.shortName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default DriversPage;
