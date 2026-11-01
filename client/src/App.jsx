import { useContext } from 'react';
import Navbar from './components/Navbar';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import IntelligenceWorkspacePage from './pages/IntelligenceWorkspacePage';
import AuthPage from './pages/AuthPage';
import { ToastContainer } from 'react-toastify';
import { AppContext } from './Context/AppContext.js';

const ProtectedRoute = ({ children }) => {
  const { user, authLoading } = useContext(AppContext);
  const location = useLocation();

  if (authLoading) {
    return (
      <main className="auth-page">
        <p>Checking your session…</p>
      </main>
    );
  }
  if (!user) return <Navigate to="/auth" replace state={{ from: location }} />;
  return children;
};

const App = () => {
  return (
    <>
      <ToastContainer className="bg-transparent" />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/workspace"
          element={
            <ProtectedRoute>
              <IntelligenceWorkspacePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
