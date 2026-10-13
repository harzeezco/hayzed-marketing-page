import { content } from '@/lib/content';
import { InterestForm } from '@/components/InterestForm';
import { WhatsAppCTA } from '@/components/WhatsAppCTA';
import { Wordmark } from '@/components/Wordmark';

export default function Home() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="header wrap">
      <a className="wordmark-link" href="#" aria-label="Hayzed home"><Wordmark/></a>
      <a className="button small" href="#early-access">Join early access <span aria-hidden="true">↗</span></a>
    </header>
    <main id="main">
      <section className="hero wrap">
        <div className="hero-copy">
          <p className="eyebrow"><span className="live-dot"/> FOR LAGOS MARKET SHOPPERS</p>
          <h1>{content.headline}<br/><em>{content.headlineAccent}</em></h1>
          <p className="intro">{content.intro}</p>
          <div className="hero-actions"><a className="button" href="#early-access">Tell us wetin you need <span aria-hidden="true">↗</span></a></div>
          <p className="hero-note">Early access · No live catalogue yet · Your input shapes what comes first</p>
        </div>
        <aside className="market-poster" aria-label="Hayzed is learning from Lagos market shoppers">
          <p className="eyebrow">ONE REQUEST AT A TIME</p>
          <div className="poster-lines"><span>Wetin you</span><strong>dey find?</strong></div>
          <p>Market runs fit take plenty time when you no know where to start. We’re starting by listening.</p>
          <div className="poster-bottom"><span>01 / LISTEN</span><span>02 / LEARN</span><span>03 / BUILD</span></div>
        </aside>
      </section>
      <div className="location-strip"><div className="wrap"><span>LAGOS MARKET RUNS, WE DEY LEARN.</span><span>Learning across Lagos markets <span aria-hidden="true">↗</span></span></div></div>
      <section id="early-access" className="signup-section"><div className="wrap signup-grid"><div className="signup-copy"><p className="eyebrow">MAKE WE HEAR YOU</p><h2>Tell us wetin<br/>you need.</h2><p>Which product you dey find? Which part of Lagos you dey? Tell us where the market search usually gets stressful.</p><p>Your answers will guide our market research. We’ll share updates as Hayzed develops.</p><div className="small-promise"><span aria-hidden="true">↗</span><p>Real requests.<br/><strong>A more useful start.</strong></p></div></div><div className="form-card"><p className="eyebrow">HAYZED EARLY ACCESS</p><h3>Make we start with your list.</h3><InterestForm/></div></div></section>
      <section className="trust wrap"><div><p className="eyebrow">WHERE WE DEY NOW</p><h2>We dey learn the markets first.</h2><p>We’re starting with real market runs and customer conversations across Lagos. The goal is a marketplace built from how buying and selling actually works here. For now, there is no live catalogue or checkout.</p></div><WhatsAppCTA/></section>
    </main>
    <footer className="wrap"><div className="footer-top"><div><a className="wordmark-link" href="#" aria-label="Hayzed home"><Wordmark/></a><p>Making Lagos market runs easier,<br/>one request at a time.</p></div><div className="footer-links"><a href={'mailto:' + content.email}>{content.email}</a><WhatsAppCTA/><a href="#privacy">Privacy</a><a href="#terms">Terms</a></div></div><div className="legal"><details id="privacy"><summary>Privacy notice</summary><p>When signups are connected, Hayzed will use the contact details and research answers you submit to understand shopping needs and contact you about early access through email and WhatsApp with your consent. Please don’t include sensitive information. To withdraw consent or request deletion, email {content.email}. This version does not use third-party analytics. Online forms currently send data only when a submission endpoint is configured.</p></details><details id="terms"><summary>Early-access terms</summary><p>Hayzed is a research and early-access project. Joining does not guarantee product availability, seller participation, prices, delivery, or a launch date. This page does not take orders or payments. Contact {content.email} with questions.</p></details></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Hayzed</span><span>Made for the way Lagos shops.</span><a href="#">Back to top ↑</a></div></footer>
  </>;
}
