import { Link } from 'react-router-dom';
import {
  AlertTriangle, ArrowRight, CheckCircle2, Clock3, MapPinned,
  Mail, Navigation, Route, ShieldCheck, UsersRound
} from 'lucide-react';

const features = [
  { icon: AlertTriangle, title: 'Easy Road Reporting', text: 'Report potholes, damaged roads, and other road safety issues in a few clear steps.' },
  { icon: MapPinned, title: 'Location-Based Reports', text: 'Help identify the exact location of road problems with address and map details.' },
  { icon: Clock3, title: 'Real-Time Status Tracking', text: 'Follow complaint progress as the report moves from review to resolution.' },
  { icon: UsersRound, title: 'Community Participation', text: 'Support reports through the available community engagement features.' }
];

const steps = [
  ['01', 'Report', 'Submit details and images of the road damage.'],
  ['02', 'Review', 'The responsible administrator reviews the complaint.'],
  ['03', 'Action', 'The complaint can be processed and its status updated.'],
  ['04', 'Track', 'Citizens can check the progress of their complaints.']
];

export default function LandingPage() {
  const scrollToFeatures = () => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL?.trim();

  return (
    <main className="landing-page" id="top">
      <nav className="landing-nav" aria-label="Main navigation">
        <a className="landing-brand" href="#top" aria-label="RoadGuard home">
          <span className="landing-brand-mark"><Route size={21} /></span>
          <span>RoadGuard</span>
        </a>
        <div className="landing-nav-links">
          <a href="#top">Home</a><a href="#features">Features</a><a href="#how-it-works">How It Works</a><a href="#contact">Contact</a>
        </div>
        <div className="landing-nav-actions">
          <Link className="landing-login-link" to="/login">Login</Link>
          <Link className="landing-button landing-button-small" to="/register">Get Started</Link>
        </div>
      </nav>

      <section className="landing-hero landing-section">
        <div className="landing-hero-copy">
          <p className="landing-eyebrow"><ShieldCheck size={16} /> Community-powered road safety</p>
          <h1>Better Roads Start <span>With You.</span></h1>
          <p className="landing-lead">Report road damage, track repairs, and help make every journey safer. Together, we can build safer roads and stronger communities.</p>
          <div className="landing-hero-actions">
            <Link className="landing-button" to="/register">Report a Road Issue <ArrowRight size={18} /></Link>
            <button className="landing-text-button" onClick={scrollToFeatures}>Explore Features <ArrowRight size={17} /></button>
          </div>
          <div className="landing-highlights">
            <div><AlertTriangle size={18} /><span>Report Road Damage</span></div>
            <div><Clock3 size={18} /><span>Track Complaint Status</span></div>
            <div><ShieldCheck size={18} /><span>Promote Safer Roads</span></div>
          </div>
        </div>

        <div className="landing-visual" aria-label="Illustration of a road issue report being tracked">
          <div className="landing-map-grid" />
          <div className="landing-road landing-road-one" /><div className="landing-road landing-road-two" />
          <div className="landing-pin landing-pin-alert"><AlertTriangle size={18} /></div>
          <div className="landing-pin landing-pin-safe"><CheckCircle2 size={17} /></div>
          <article className="landing-report-preview">
            <div className="landing-report-preview-top"><span className="landing-preview-icon"><AlertTriangle size={18} /></span><span className="landing-preview-status">In progress</span></div>
            <strong>Road surface damage</strong>
            <p><MapPinned size={14} /> Location shared</p>
            <div className="landing-progress"><span /></div>
          </article>
          <div className="landing-location-pill"><Navigation size={15} /> Report location verified</div>
        </div>
      </section>

      <section className="landing-section landing-feature-section" id="features">
        <div className="landing-section-heading"><p className="landing-eyebrow">Designed for action</p><h2>Everything You Need for Better Roads</h2><p>Simple tools to report issues, understand progress, and stay informed.</p></div>
        <div className="landing-feature-grid">
          {features.map(({ icon: Icon, title, text }) => <article className="landing-feature-card" key={title}><span className="landing-feature-icon"><Icon size={23} /></span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="landing-section landing-how-section" id="how-it-works">
        <div className="landing-section-heading"><p className="landing-eyebrow">A clearer path to repair</p><h2>From Report to Repair</h2><p>Each update keeps citizens informed while work moves forward.</p></div>
        <div className="landing-steps">
          {steps.map(([number, title, text]) => <article className="landing-step" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="landing-section landing-cta-section">
        <div><p className="landing-eyebrow">Make your route safer</p><h2>Your Report Can Make a Difference</h2><p>Help identify road problems in your community and contribute to safer journeys.</p></div>
        <div className="landing-cta-actions"><Link className="landing-button" to="/register">Get Started <ArrowRight size={18} /></Link><Link className="landing-button landing-button-outline" to="/login">Login</Link></div>
      </section>

      <section className="landing-section landing-contact" id="contact">
        <span className="landing-contact-icon"><Mail size={24} /></span>
        <div>
          <h2>Need help with an unresolved report?</h2>
          <p>Sign in to check your report ID, latest update, and assigned department before requesting further help.</p>
          {supportEmail && <a className="landing-support-email" href={'mailto:' + supportEmail}>{supportEmail}</a>}
        </div>
        <Link className="landing-button landing-button-outline" to="/login">Check my report</Link>
      </section>

      <footer className="landing-footer">
        <div><a className="landing-brand" href="#top"><span className="landing-brand-mark"><Route size={20} /></span><span>RoadGuard</span></a><p>Smart road damage reporting and repair tracking for safer journeys.</p></div>
        <div className="landing-footer-links"><a href="#features">Features</a><a href="#how-it-works">How It Works</a><a href="#contact">Contact</a><Link to="/login">Login</Link><Link to="/register">Register</Link></div>
        <div className="landing-footer-bottom"><span>© {new Date().getFullYear()} RoadGuard</span><span>Building safer roads, one report at a time.</span></div>
      </footer>
    </main>
  );
}
