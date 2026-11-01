import { Fingerprint, Globe2, MailCheck, Network, ScanSearch, ShieldCheck } from 'lucide-react';

const capabilities = [
  [Globe2, 'Domain intelligence', 'WHOIS records and registration context'],
  [Network, 'Infrastructure mapping', 'Subdomains, IP history and reverse IP'],
  [ShieldCheck, 'Threat assessment', 'Malware reputation and port exposure'],
  [MailCheck, 'Email forensics', 'Header analysis and address validation'],
  [Fingerprint, 'Identity signals', 'Carrier and MAC address lookups'],
  [ScanSearch, 'Hash investigation', 'Check password hashes against known data'],
];
const About = () => (
  <section id="capabilities" className="capabilities-section section-wrap">
    <div className="section-heading">
      <div>
        <div className="eyebrow">A SINGLE VIEW OF THE DIGITAL TERRAIN</div>
        <h2>
          Built for the <span>investigation</span>
        </h2>
        <p>
          Bring disconnected indicators into a clear, actionable view. Run focused lookups through a
          unified interface.
        </p>
      </div>
      <div className="section-index">
        CAPABILITIES <span>↘</span>
      </div>
    </div>
    <div className="capability-grid">
      {capabilities.map(([Icon, title, desc], i) => (
        <article className="capability-card" key={title}>
          <div className="capability-top">
            <span className="cap-icon">
              <Icon size={19} />
            </span>
            <span className="cap-number">0{i + 1}</span>
          </div>
          <h3>{title}</h3>
          <p>{desc}</p>
          <span className="card-line" />
        </article>
      ))}
    </div>
  </section>
);
export default About;
