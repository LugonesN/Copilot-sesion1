import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { username, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="page-center">
      <div className="card">
        <h1 className="card-title">Dashboard</h1>
        <p className="card-subtitle">
          Welcome back, <span className="highlight">{username ?? '…'}</span>
        </p>

        <div className="dashboard-info">
          <p className="body-text">
            You are authenticated via JWT. Your session will automatically
            refresh when needed.
          </p>
        </div>

        <button type="button" className="btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
