import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../Context/AppContext.js';
import Hero from '../components/Hero';
import Terminal from '../components/Terminal';
import About from '../components/About';
import Team from '../components/Team';
import Footer from '../components/Footer';

const HomePage = () => {
  const { user, authLoading } = useContext(AppContext);

  return (
    <main>
      <Hero />
      <About />
      <section id="workspace" className="workspace-section section-wrap">
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              <span className="live-dot" /> INVESTIGATION SUITE
            </div>
            <h2>
              Intelligence <span>workspace</span>
            </h2>
            <p>Choose a capability, enter an indicator, and inspect the returned signal.</p>
          </div>
          <div className="section-index">
            01 <span>/</span> 10+ TOOLS
          </div>
        </div>
        {authLoading ? (
          <div className="workspace-auth-prompt">Checking your sign-in…</div>
        ) : user ? (
          <Terminal />
        ) : (
          <div className="workspace-auth-prompt">
            <h3>Sign in to use the intelligence tools</h3>
            <p>Your account keeps your lookup activity associated with you.</p>
            <Link className="button-primary" to="/auth">Sign in or create an account</Link>
          </div>
        )}
      </section>
      <div id="team">
        <Team />
      </div>
      <Footer />
    </main>
  );
};
export default HomePage;
