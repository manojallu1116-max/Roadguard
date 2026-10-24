import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle, ArrowRight, CheckCircle2, Clock3, Languages, Mail,
  MapPinned, Moon, Navigation, Route, ShieldCheck, Sun, UsersRound
} from 'lucide-react';
import '../landingPreferences.css';

const landingCopy = {
  en: {
    home: 'Home',
    featuresNav: 'Features',
    howNav: 'How It Works',
    contactNav: 'Contact',
    login: 'Login',
    getStarted: 'Get Started',
    communitySafety: 'Community-powered road safety',
    heroTitle: 'Better Roads Start',
    heroTitleAccent: 'With You.',
    heroLead: 'Report road damage, track repairs, and help make every journey safer. Together, we can build safer roads and stronger communities.',
    reportIssue: 'Report a Road Issue',
    exploreFeatures: 'Explore Features',
    highlights: ['Report Road Damage', 'Track Complaint Status', 'Promote Safer Roads'],
    featureEyebrow: 'Designed for action',
    featureTitle: 'Everything You Need for Better Roads',
    featureLead: 'Simple tools to report issues, understand progress, and stay informed.',
    features: [
      ['Easy Road Reporting', 'Report potholes, damaged roads, and other road safety issues in a few clear steps.'],
      ['Location-Based Reports', 'Help identify the exact location of road problems with address and map details.'],
      ['Real-Time Status Tracking', 'Follow complaint progress as the report moves from review to resolution.'],
      ['Community Participation', 'Support reports through the available community engagement features.']
    ],
    howEyebrow: 'A clearer path to repair',
    howTitle: 'From Report to Repair',
    howLead: 'Each update keeps citizens informed while work moves forward.',
    steps: [
      ['Report', 'Submit details and images of the road damage.'],
      ['Review', 'The responsible administrator reviews the complaint.'],
      ['Action', 'The complaint can be processed and its status updated.'],
      ['Track', 'Citizens can check the progress of their complaints.']
    ],
    previewIssue: 'Road surface damage',
    inProgress: 'In progress',
    locationShared: 'Location shared',
    locationVerified: 'Report location verified',
    ctaEyebrow: 'Make your route safer',
    ctaTitle: 'Your Report Can Make a Difference',
    ctaLead: 'Help identify road problems in your community and contribute to safer journeys.',
    contactTitle: 'Need help with an unresolved report?',
    contactLead: 'Sign in to check your report ID, latest update, and assigned department before requesting further help.',
    checkReport: 'Check my report',
    footerLead: 'Smart road damage reporting and repair tracking for safer journeys.',
    footerTagline: 'Building safer roads, one report at a time.',
    themeDark: 'Switch to light theme',
    themeLight: 'Switch to dark theme',
    languageLabel: 'Language',
    navigationLabel: 'Main navigation',
    settingsLabel: 'Landing page settings'
  },
  te: {
    home: 'హోమ్',
    featuresNav: 'ఫీచర్లు',
    howNav: 'ఎలా పనిచేస్తుంది',
    contactNav: 'సంప్రదింపు',
    login: 'లాగిన్',
    getStarted: 'ప్రారంభించండి',
    communitySafety: 'సమాజ భాగస్వామ్యంతో రహదారి భద్రత',
    heroTitle: 'మెరుగైన రహదారులు',
    heroTitleAccent: 'మీతోనే మొదలు.',
    heroLead: 'రహదారి నష్టాన్ని నివేదించండి, మరమ్మతులను అనుసరించండి, ప్రతి ప్రయాణాన్ని సురక్షితంగా చేయడంలో తోడ్పడండి. కలిసి సురక్షితమైన రహదారులు, బలమైన సమాజాలను నిర్మిద్దాం.',
    reportIssue: 'రహదారి సమస్యను నివేదించండి',
    exploreFeatures: 'ఫీచర్లను చూడండి',
    highlights: ['రహదారి నష్టాన్ని నివేదించండి', 'ఫిర్యాదు స్థితిని అనుసరించండి', 'సురక్షిత రహదారులకు తోడ్పడండి'],
    featureEyebrow: 'చర్యకు అనువుగా రూపొందించబడింది',
    featureTitle: 'మెరుగైన రహదారుల కోసం అవసరమైనవి',
    featureLead: 'సమస్యలను నివేదించడానికి, పురోగతిని తెలుసుకోవడానికి, సమాచారం పొందడానికి సులభమైన సాధనాలు.',
    features: [
      ['సులభమైన రహదారి నివేదిక', 'కొన్ని సులభమైన దశల్లో గుంతలు, దెబ్బతిన్న రహదారులు, ఇతర భద్రతా సమస్యలను నివేదించండి.'],
      ['ప్రాంత వివరాలతో నివేదికలు', 'చిరునామా, మ్యాప్ వివరాలతో రహదారి సమస్యల ఖచ్చితమైన ప్రదేశాన్ని గుర్తించడంలో సహాయపడండి.'],
      ['స్థితి ప్రత్యక్ష అనుసరణ', 'పరిశీలన నుంచి పరిష్కారం వరకు ఫిర్యాదు పురోగతిని తెలుసుకోండి.'],
      ['సమాజ భాగస్వామ్యం', 'అందుబాటులో ఉన్న సమాజ భాగస్వామ్య సదుపాయాల ద్వారా నివేదికలకు మద్దతు ఇవ్వండి.']
    ],
    howEyebrow: 'మరమ్మతుకు స్పష్టమైన మార్గం',
    howTitle: 'నివేదిక నుంచి మరమ్మతు వరకు',
    howLead: 'పని ముందుకు సాగుతున్నప్పుడు ప్రతి నవీకరణ పౌరులకు సమాచారం అందిస్తుంది.',
    steps: [
      ['నివేదించండి', 'రహదారి నష్టం వివరాలు, చిత్రాలను సమర్పించండి.'],
      ['పరిశీలన', 'బాధ్యతగల నిర్వాహకుడు ఫిర్యాదును పరిశీలిస్తారు.'],
      ['చర్య', 'ఫిర్యాదుపై చర్య తీసుకుని స్థితిని నవీకరించవచ్చు.'],
      ['అనుసరించండి', 'పౌరులు తమ ఫిర్యాదుల పురోగతిని చూడవచ్చు.']
    ],
    previewIssue: 'రహదారి ఉపరితల నష్టం',
    inProgress: 'పురోగతిలో ఉంది',
    locationShared: 'ప్రదేశం పంచబడింది',
    locationVerified: 'నివేదిక ప్రదేశం నిర్ధారించబడింది',
    ctaEyebrow: 'మీ ప్రయాణ మార్గాన్ని సురక్షితం చేయండి',
    ctaTitle: 'మీ నివేదిక మార్పు తీసుకురాగలదు',
    ctaLead: 'మీ ప్రాంతంలోని రహదారి సమస్యలను గుర్తించి సురక్షిత ప్రయాణాలకు తోడ్పడండి.',
    contactTitle: 'పరిష్కారం కాని నివేదికపై సహాయం కావాలా?',
    contactLead: 'మరింత సహాయం కోరే ముందు మీ నివేదిక ఐడి, తాజా సమాచారం, కేటాయించిన శాఖను చూడటానికి సైన్ ఇన్ చేయండి.',
    checkReport: 'నా నివేదికను చూడండి',
    footerLead: 'సురక్షిత ప్రయాణాల కోసం రహదారి నష్టం నివేదికలు, మరమ్మతుల అనుసరణ.',
    footerTagline: 'ప్రతి నివేదికతో సురక్షిత రహదారుల నిర్మాణం.',
    themeDark: 'లైట్ థీమ్‌కు మార్చండి',
    themeLight: 'డార్క్ థీమ్‌కు మార్చండి',
    languageLabel: 'భాష',
    navigationLabel: 'ప్రధాన నావిగేషన్',
    settingsLabel: 'ల్యాండింగ్ పేజీ సెట్టింగ్‌లు'
  },
  hi: {
    home: 'होम',
    featuresNav: 'विशेषताएँ',
    howNav: 'यह कैसे काम करता है',
    contactNav: 'संपर्क',
    login: 'लॉग इन',
    getStarted: 'शुरू करें',
    communitySafety: 'समुदाय की भागीदारी से सड़क सुरक्षा',
    heroTitle: 'बेहतर सड़कें',
    heroTitleAccent: 'आपसे शुरू होती हैं।',
    heroLead: 'सड़क की क्षति की रिपोर्ट करें, मरम्मत की स्थिति जानें और हर यात्रा को सुरक्षित बनाने में मदद करें। साथ मिलकर सुरक्षित सड़कें और मजबूत समुदाय बना सकते हैं।',
    reportIssue: 'सड़क की समस्या रिपोर्ट करें',
    exploreFeatures: 'विशेषताएँ देखें',
    highlights: ['सड़क की क्षति रिपोर्ट करें', 'शिकायत की स्थिति जानें', 'सुरक्षित सड़कों में योगदान दें'],
    featureEyebrow: 'कार्रवाई के लिए बनाया गया',
    featureTitle: 'बेहतर सड़कों के लिए आपकी ज़रूरत की हर चीज़',
    featureLead: 'समस्याएँ रिपोर्ट करने, प्रगति जानने और जानकारी पाने के आसान साधन।',
    features: [
      ['आसान सड़क रिपोर्ट', 'कुछ आसान चरणों में गड्ढों, क्षतिग्रस्त सड़कों और अन्य सुरक्षा समस्याओं की रिपोर्ट करें।'],
      ['स्थान सहित रिपोर्ट', 'पता और नक्शे की जानकारी से सड़क की समस्या का सही स्थान पहचानने में मदद करें।'],
      ['स्थिति की ताज़ा जानकारी', 'समीक्षा से समाधान तक शिकायत की प्रगति देखें।'],
      ['समुदाय की भागीदारी', 'उपलब्ध सामुदायिक सुविधाओं के माध्यम से रिपोर्ट का समर्थन करें।']
    ],
    howEyebrow: 'मरम्मत का स्पष्ट रास्ता',
    howTitle: 'रिपोर्ट से मरम्मत तक',
    howLead: 'काम आगे बढ़ने पर हर अपडेट नागरिकों को जानकारी देता है।',
    steps: [
      ['रिपोर्ट करें', 'सड़क की क्षति का विवरण और तस्वीरें भेजें।'],
      ['समीक्षा', 'ज़िम्मेदार प्रशासक शिकायत की समीक्षा करता है।'],
      ['कार्रवाई', 'शिकायत पर कार्रवाई करके उसकी स्थिति अपडेट की जा सकती है।'],
      ['जानकारी रखें', 'नागरिक अपनी शिकायतों की प्रगति देख सकते हैं।']
    ],
    previewIssue: 'सड़क की सतह क्षतिग्रस्त',
    inProgress: 'प्रगति पर',
    locationShared: 'स्थान साझा किया गया',
    locationVerified: 'रिपोर्ट का स्थान सत्यापित',
    ctaEyebrow: 'अपने रास्ते को सुरक्षित बनाएँ',
    ctaTitle: 'आपकी रिपोर्ट बदलाव ला सकती है',
    ctaLead: 'अपने समुदाय में सड़क की समस्याएँ पहचानने और सुरक्षित यात्राओं में योगदान देने में मदद करें।',
    contactTitle: 'अनसुलझी रिपोर्ट में मदद चाहिए?',
    contactLead: 'आगे सहायता माँगने से पहले अपनी रिपोर्ट आईडी, नवीनतम अपडेट और निर्धारित विभाग देखने के लिए साइन इन करें।',
    checkReport: 'मेरी रिपोर्ट देखें',
    footerLead: 'सुरक्षित यात्राओं के लिए सड़क क्षति रिपोर्ट और मरम्मत की जानकारी।',
    footerTagline: 'हर रिपोर्ट के साथ सुरक्षित सड़कों की ओर।',
    themeDark: 'लाइट थीम पर जाएँ',
    themeLight: 'डार्क थीम पर जाएँ',
    languageLabel: 'भाषा',
    navigationLabel: 'मुख्य नेविगेशन',
    settingsLabel: 'लैंडिंग पेज सेटिंग्स'
  }
};

const featureIcons = [AlertTriangle, MapPinned, Clock3, UsersRound];
const stepNumbers = ['01', '02', '03', '04'];

function readPreference(key, fallback, allowedValues) {
  try {
    const value = window.localStorage.getItem(key);
    return allowedValues.includes(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

export default function LandingPage() {
  const [theme, setTheme] = useState(() => readPreference('roadguard.landing.theme', 'dark', ['dark', 'light']));
  const [language, setLanguage] = useState(() => readPreference('roadguard.landing.language', 'en', ['en', 'te', 'hi']));
  const copy = landingCopy[language];
  const scrollToFeatures = () => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL?.trim();

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      window.localStorage.setItem('roadguard.landing.theme', theme);
      window.localStorage.setItem('roadguard.landing.language', language);
    } catch {
      // Preferences remain available for the current page session.
    }
  }, [language, theme]);

  return (
    <main className="landing-page" id="top" data-landing-theme={theme} lang={language}>
      <nav className="landing-nav" aria-label={copy.navigationLabel}>
        <a className="landing-brand" href="#top" aria-label="RoadGuard home">
          <span className="landing-brand-mark"><Route size={21} /></span>
          <span>RoadGuard</span>
        </a>
        <div className="landing-nav-links">
          <a href="#top">{copy.home}</a><a href="#features">{copy.featuresNav}</a><a href="#how-it-works">{copy.howNav}</a><a href="#contact">{copy.contactNav}</a>
        </div>
        <div className="landing-nav-actions">
          <div className="landing-preferences" aria-label={copy.settingsLabel}>
            <button
              className="landing-preference-button"
              type="button"
              onClick={() => setTheme(current => current === 'dark' ? 'light' : 'dark')}
              aria-label={theme === 'dark' ? copy.themeDark : copy.themeLight}
              title={theme === 'dark' ? copy.themeDark : copy.themeLight}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <label className="landing-language-control">
              <Languages size={17} aria-hidden="true" />
              <span className="sr-only">{copy.languageLabel}</span>
              <select value={language} onChange={event => setLanguage(event.target.value)} aria-label={copy.languageLabel}>
                <option value="en">English</option>
                <option value="te">తెలుగు</option>
                <option value="hi">हिन्दी</option>
              </select>
            </label>
          </div>
          <Link className="landing-login-link" to="/login">{copy.login}</Link>
          <Link className="landing-button landing-button-small" to="/register">{copy.getStarted}</Link>
        </div>
      </nav>

      <section className="landing-hero landing-section">
        <div className="landing-hero-copy">
          <p className="landing-eyebrow"><ShieldCheck size={16} /> {copy.communitySafety}</p>
          <h1>{copy.heroTitle} <span>{copy.heroTitleAccent}</span></h1>
          <p className="landing-lead">{copy.heroLead}</p>
          <div className="landing-hero-actions">
            <Link className="landing-button" to="/register">{copy.reportIssue} <ArrowRight size={18} /></Link>
            <button className="landing-text-button" onClick={scrollToFeatures}>{copy.exploreFeatures} <ArrowRight size={17} /></button>
          </div>
          <div className="landing-highlights">
            <div><AlertTriangle size={18} /><span>{copy.highlights[0]}</span></div>
            <div><Clock3 size={18} /><span>{copy.highlights[1]}</span></div>
            <div><ShieldCheck size={18} /><span>{copy.highlights[2]}</span></div>
          </div>
        </div>

        <div className="landing-visual" aria-label={copy.previewIssue}>
          <div className="landing-map-grid" />
          <div className="landing-road landing-road-one" /><div className="landing-road landing-road-two" />
          <div className="landing-pin landing-pin-alert"><AlertTriangle size={18} /></div>
          <div className="landing-pin landing-pin-safe"><CheckCircle2 size={17} /></div>
          <article className="landing-report-preview">
            <div className="landing-report-preview-top"><span className="landing-preview-icon"><AlertTriangle size={18} /></span><span className="landing-preview-status">{copy.inProgress}</span></div>
            <strong>{copy.previewIssue}</strong>
            <p><MapPinned size={14} /> {copy.locationShared}</p>
            <div className="landing-progress"><span /></div>
          </article>
          <div className="landing-location-pill"><Navigation size={15} /> {copy.locationVerified}</div>
        </div>
      </section>

      <section className="landing-section landing-feature-section" id="features">
        <div className="landing-section-heading"><p className="landing-eyebrow">{copy.featureEyebrow}</p><h2>{copy.featureTitle}</h2><p>{copy.featureLead}</p></div>
        <div className="landing-feature-grid">
          {copy.features.map(([title, text], index) => {
            const Icon = featureIcons[index];
            return <article className="landing-feature-card" key={title}><span className="landing-feature-icon"><Icon size={23} /></span><h3>{title}</h3><p>{text}</p></article>;
          })}
        </div>
      </section>

      <section className="landing-section landing-how-section" id="how-it-works">
        <div className="landing-section-heading"><p className="landing-eyebrow">{copy.howEyebrow}</p><h2>{copy.howTitle}</h2><p>{copy.howLead}</p></div>
        <div className="landing-steps">
          {copy.steps.map(([title, text], index) => <article className="landing-step" key={stepNumbers[index]}><span>{stepNumbers[index]}</span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="landing-section landing-cta-section">
        <div><p className="landing-eyebrow">{copy.ctaEyebrow}</p><h2>{copy.ctaTitle}</h2><p>{copy.ctaLead}</p></div>
        <div className="landing-cta-actions"><Link className="landing-button" to="/register">{copy.getStarted} <ArrowRight size={18} /></Link><Link className="landing-button landing-button-outline" to="/login">{copy.login}</Link></div>
      </section>

      <section className="landing-section landing-contact" id="contact">
        <span className="landing-contact-icon"><Mail size={24} /></span>
        <div>
          <h2>{copy.contactTitle}</h2>
          <p>{copy.contactLead}</p>
          {supportEmail && <a className="landing-support-email" href={'mailto:' + supportEmail}>{supportEmail}</a>}
        </div>
        <Link className="landing-button landing-button-outline" to="/login">{copy.checkReport}</Link>
      </section>

      <footer className="landing-footer">
        <div><a className="landing-brand" href="#top"><span className="landing-brand-mark"><Route size={20} /></span><span>RoadGuard</span></a><p>{copy.footerLead}</p></div>
        <div className="landing-footer-links"><a href="#features">{copy.featuresNav}</a><a href="#how-it-works">{copy.howNav}</a><a href="#contact">{copy.contactNav}</a><Link to="/login">{copy.login}</Link><Link to="/register">{copy.getStarted}</Link></div>
        <div className="landing-footer-bottom"><span>© {new Date().getFullYear()} RoadGuard</span><span>{copy.footerTagline}</span></div>
      </footer>
    </main>
  );
}
