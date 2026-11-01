import { Shield } from 'lucide-react';
const Footer = () => (
  <footer className="site-footer">
    <div className="footer-brand">
      <span className="brand-mark">
        <Shield size={18} />
      </span>
      <span>
        BHARAT<span className="brand-light">NETRA</span>
      </span>
    </div>
    <span>CYBER INTELLIGENCE / DIGITAL INVESTIGATION</span>
    <div className="footer-copy">
      <Shield size={14} /> ©{new Date().getFullYear()}BharatNetra
    </div>
  </footer>
);
export default Footer;
