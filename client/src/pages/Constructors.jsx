import Navbar from '../components/Navbar';

function Constructors() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Constructors</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: "Red Bull Racing", price: "$30.0M", points: 525, drivers: ["Max Verstappen", "Sergio Pérez"] },
            { name: "Mercedes", price: "$28.5M", points: 490, drivers: ["Lewis Hamilton", "George Russell"] },
            { name: "Ferrari", price: "$27.0M", points: 475, drivers: ["Charles Leclerc", "Carlos Sainz"] },
            { name: "McLaren", price: "$25.5M", points: 420, drivers: ["Lando Norris", "Oscar Piastri"] },
            { name: "Aston Martin", price: "$22.0M", points: 385, drivers: ["Fernando Alonso", "Lance Stroll"] },
            { name: "Alpine", price: "$18.5M", points: 245, drivers: ["Pierre Gasly", "Esteban Ocon"] },
          ].map((constructor, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{constructor.name}</h3>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p><strong>Price:</strong> {constructor.price}</p>
                <p><strong>Points:</strong> {constructor.points}</p>
                <p><strong>Drivers:</strong></p>
                <ul className="ml-4">
                  {constructor.drivers.map((driver, idx) => (
                    <li key={idx}>• {driver}</li>
                  ))}
                </ul>
              </div>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                Select Constructor
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Constructors;
