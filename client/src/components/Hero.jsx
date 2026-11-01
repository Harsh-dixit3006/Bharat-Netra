import { ArrowDownRight, ArrowRight, Crosshair, Radio, ShieldCheck } from 'lucide-react';

const Hero = () => (
  <section id="home" className="hero-shell">
    <div className="hero-image" />
    <div className="hero-grid" />
    <div className="hero-vignette" />
    <div className="hero-content">
      <div className="eyebrow">
        <span className="live-dot" /> NATIONAL CYBER INTELLIGENCE PLATFORM{' '}
        <span className="eyebrow-line" />
      </div>
      <h1>
        See the signal.
        <br />
        <span>Secure the nation.</span>
      </h1>
      <p className="hero-copy">
        A unified intelligence workspace for digital investigations. Connect domain, IP, email and
        threat signals in one place.
      </p>
      <div className="hero-actions">
        <a className="button-primary" href="#workspace">
          Open intelligence workspace <ArrowRight size={17} />
        </a>
        <a className="button-quiet" href="#capabilities">
          Explore capabilities <ArrowDownRight size={17} />
        </a>
      </div>
      <div className="hero-proof">
        <span>
          <ShieldCheck size={16} /> Investigation ready
        </span>
        <span>
          <Radio size={16} /> Multi-source signals
        </span>
        <span>
          <Crosshair size={16} /> Precision lookups
        </span>
      </div>
    </div>
    <div className="hero-coordinates">
      <span>BHARAT NETRA / 01</span>
      <span>INTELLIGENCE • SECURITY • RESPONSE</span>
    </div>
    <div className="hero-scroll">
      SCROLL TO EXPLORE <span />
    </div>
  </section>
);
export default Hero;
