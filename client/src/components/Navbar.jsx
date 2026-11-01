import { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Shield, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { AppContext } from '../Context/AppContext.js';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, authLoading, logout } = useContext(AppContext);
  const items = [
    ['Overview', '/#home'],
    ['Capabilities', '/#capabilities'],
    ['Intel workspace', '/#workspace'],
    ['Team', '/#team'],
  ];
  const hrefFor = (href) => (pathname === '/' ? href.replace('/', '') : href);
  return (
    <header className="topbar">
      <Link to="/" className="brand" onClick={() => setOpen(false)}>
        <span className="brand-mark">
          <Shield size={19} />
        </span>
        <span>
          BHARAT<span className="brand-light">NETRA</span>
          <small>CYBER INTELLIGENCE</small>
        </span>
      </Link>
      <nav className={open ? 'nav-links nav-open' : 'nav-links'}>
        {items.map(([label, href]) => (
          <a key={label} href={hrefFor(href)} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
        <Link className="nav-console" to="/workspace" onClick={() => setOpen(false)}>
          Command center <span>↗</span>
        </Link>
        {!authLoading && (user ? (
          <>
            <span className="nav-user">{user.name}</span>
            <button
              className="nav-auth-button"
              onClick={async () => {
                try {
                  await logout();
                  setOpen(false);
                  navigate('/');
                } catch (error) {
                  toast.error(error.response?.data?.error || 'Unable to sign out');
                }
              }}
            >
              Sign out
            </button>
          </>
        ) : (
          <Link className="nav-auth-button" to="/auth" onClick={() => setOpen(false)}>
            Sign in
          </Link>
        ))}
      </nav>
      <button
        className="mobile-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
      >
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
};
export default Navbar;
