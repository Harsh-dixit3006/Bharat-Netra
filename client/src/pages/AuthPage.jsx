import { useContext, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../Context/AppContext.js';

const AuthPage = () => {
  const { user, authLoading, login, register } = useContext(AppContext);
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (authLoading) {
    return <main className="auth-page"><p>Checking your session…</p></main>;
  }

  if (user) {
    return <Navigate to="/workspace" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (isRegistering) {
        await register({ name, email, password });
      } else {
        await login({ email, password });
      }

      navigate(location.state?.from?.pathname || '/workspace', { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to authenticate. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="eyebrow"><span className="live-dot" /> SECURE ACCESS</div>
        <h1>{isRegistering ? 'Create your account' : 'Welcome back'}</h1>
        <p className="auth-description">
          {isRegistering
            ? 'Create an account to access the intelligence workspace.'
            : 'Sign in to continue to the Bharat Netra command center.'}
        </p>
        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegistering && (
            <label>
              Name
              <input
                autoComplete="name"
                maxLength={50}
                onChange={(event) => setName(event.target.value)}
                required
                value={name}
              />
            </label>
          )}
          <label>
            Email
            <input
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>
          <label>
            Password
            <input
              autoComplete={isRegistering ? 'new-password' : 'current-password'}
              minLength={6}
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="button-primary auth-submit" disabled={submitting} type="submit">
            {submitting ? 'PLEASE WAIT…' : isRegistering ? 'CREATE ACCOUNT' : 'SIGN IN'}
          </button>
        </form>
        <p className="auth-switch">
          {isRegistering ? 'Already have an account?' : 'New to Bharat Netra?'}{' '}
          <button
            onClick={() => {
              setIsRegistering((current) => !current);
              setError('');
            }}
            type="button"
          >
            {isRegistering ? 'Sign in' : 'Create account'}
          </button>
        </p>
        <Link className="auth-home-link" to="/">Return to overview</Link>
      </section>
    </main>
  );
};

export default AuthPage;
