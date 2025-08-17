import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          F1 Fantasy League
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Welcome to the ultimate Formula 1 fantasy experience!
        </p>
        <div className="space-y-4">
          <Link
            to="/signup"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 block text-center"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-300 block text-center"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Landing;
