import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { constructorService } from '../services/constructorService';

function Constructors() {
  const [constructors, setConstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConstructors = async () => {
      try {
        setLoading(true);
        const result = await constructorService.getAllConstructors();
        if (result.success) {
          setConstructors(result.data);
        } else {
          console.error('Error fetching constructors:', result.message || 'Failed to fetch constructors');
        }
      } catch (error) {
        console.error('Error fetching constructors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConstructors();
  }, []);

  if (loading) {
    return (
      <Layout title="F1 Constructors">
        <div className="flex items-center justify-center h-64">
          <div className="text-xl text-gray-300">Loading constructors...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="F1 Constructors">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black mb-2">Constructor Teams</h1>
            <p className="text-gray-300">Elite F1 racing teams and their legacy</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#FF1801]">{constructors.length}</div>
            <div className="text-sm text-gray-400">Total Teams</div>
          </div>
        </div>

        {/* Constructors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {constructors.map((constructor, index) => (
            <div key={index} className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 hover:bg-white/[0.08] transition-all duration-300 hover:scale-105">
              <div className="text-center mb-6">
                <div className="inline-flex h-16 w-16 rounded-full bg-gradient-to-br from-[#FF1801] to-red-600 items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-lg">{constructor.name.charAt(0)}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-[#FF1801] transition-colors">
                  {constructor.name}
                </h3>
                <p className="text-gray-400 text-sm uppercase tracking-wide">
                  {constructor.nationality}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-sm text-gray-400">Constructor Championships</span>
                  <span className="font-bold text-yellow-400">
                    {constructor.constructorsChampionships == null ? 0 : constructor.constructorsChampionships}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-400">Drivers Championships</span>
                  <span className="font-bold text-yellow-400">
                    {constructor.driversChampionships == null ? 0 : constructor.driversChampionships}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Constructors;
