import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';
import { constructorService } from '../services/constructorService';


function Constructors() {
  const [constructors, setConstructors] = useState([]);

  useEffect(() => {
    const fetchConstructors = async () => {
      try {
        const result = await constructorService.getAllConstructors();
        if(result.success){
          setConstructors(result.data);
        } 
        else {
          console.error('Error fetching constructors:', result.message || 'Failed to fetch constructors');
        }

      } catch (error) {
        console.error('Error fetching constructors:', error);
      }
    };

    fetchConstructors();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Constructors</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {constructors.map((constructor, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{constructor.name}</h3>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p><strong>Nationality:</strong> {constructor.nationality}</p>
                <p><strong>Constructor Championships:</strong> {
                constructor.constructorsChampionships == null ? 0 : constructor.constructorsChampionships
                }</p>
                <p><strong>Drivers Championships:</strong> {
                  constructor.driversChampionships == null ? 0 : constructor.driversChampionships
                }</p>

              </div>
            
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Constructors;
