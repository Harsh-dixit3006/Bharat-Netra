import { ScanSearch } from 'lucide-react';
import Terminal from '../components/Terminal';

const IntelligenceWorkspacePage = () => (
  <main className="workspace-page">
    <section className="workspace-section section-wrap">
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
          <ScanSearch size={16} /> <span>/</span> 11 TOOLS
        </div>
      </div>
      <Terminal />
    </section>
  </main>
);

export default IntelligenceWorkspacePage;
