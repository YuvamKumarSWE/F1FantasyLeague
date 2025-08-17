import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Drivers from './pages/Drivers';
import Constructors from './pages/Constructors';
import Results from './pages/Results';
import FantasyTeam from './pages/FantasyTeam';
import Races from './pages/Races';
import Standings from './pages/Standings';
import Leaderboard from './pages/Leaderboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/landing" replace />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/drivers" element={
            <ProtectedRoute>
              <Drivers />
            </ProtectedRoute>
          } />
          <Route path="/constructors" element={
            <ProtectedRoute>
              <Constructors />
            </ProtectedRoute>
          } />
          <Route path="/results" element={
            <ProtectedRoute>
              <Results />
            </ProtectedRoute>
          } />
          <Route path="/fantasy-team" element={
            <ProtectedRoute>
              <FantasyTeam />
            </ProtectedRoute>
          } />
          <Route path="/races" element={
            <ProtectedRoute>
              <Races />
            </ProtectedRoute>
          } />
          <Route path="/standings" element={
            <ProtectedRoute>
              <Standings />
            </ProtectedRoute>
          } />
          <Route path="/leaderboard" element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
