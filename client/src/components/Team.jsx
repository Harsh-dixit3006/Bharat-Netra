import { Linkedin, UserRound } from 'lucide-react';
import harsh from '../../public/Harsh.png';
const Team = () => (
  <section className="team-section section-wrap">
    <div className="section-heading">
      <div>
        <div className="eyebrow">THE PERSON BEHIND THE PLATFORM</div>
        <h2>
          Meet the <span>operator</span>
        </h2>
        <p>Built with a focus on clarity, speed and useful intelligence.</p>
      </div>
      <div className="section-index">
        TEAM <span>01</span>
      </div>
    </div>
    <article className="team-card">
      <div className="team-photo">
        <img src={harsh} alt="Harsh Dixit" />
        <span className="photo-status" />
      </div>
      <div className="team-copy">
        <span className="eyebrow">FOUNDER / DEVELOPER</span>
        <h3>Harsh Dixit</h3>
        <p>
          Building Bharat Netra, a unified workspace for cyber intelligence and digital
          investigations.
        </p>
        <a
          href="https://www.linkedin.com/in/harsh-dixit-65820b311/"
          target="_blank"
          rel="noreferrer"
        >
          <Linkedin size={16} /> CONNECT ON LINKEDIN <span>↗</span>
        </a>
      </div>
      <div className="team-mark">
        <UserRound size={28} />
        <span>BN / 01</span>
      </div>
    </article>
  </section>
);
export default Team;
