import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './LoginPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Redirect to the page they tried to visit or admin
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="login-page">
      <Header />

      <main className="login-main">
        <div className="login-container">
          <div className="login-card">
            <h1>Admin Login</h1>
            <p className="login-subtitle">
              Sign in to access the Campaign Toolkit admin area
            </p>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="admin@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ width: '100%' }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="login-info">
              <p>
                <strong>Note:</strong> This login uses Supabase Auth. SSO can be configured in Supabase dashboard.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
