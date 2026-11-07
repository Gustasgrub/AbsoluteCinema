import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../auth/AuthContext.jsx';
import Loader from './Loader.jsx';
import { ErrorState } from './States.jsx';

// Puslapis tik administratoriui. (Tikroji apsauga – API pusėje; čia tik patogumas naudotojui.)
export default function RequireAdmin({ children }) {
  const { ready, user, isAdmin } = useAuth();
  const { pathname } = useLocation();

  if (!ready) return <Loader />;
  if (!user) return <Navigate to="/login" replace state={{ from: pathname }} />;
  if (!isAdmin) {
    return (
      <div className="container">
        <ErrorState error={{ status: 403, message: 'This room is for cinema staff only.' }} />
      </div>
    );
  }

  return children;
}
