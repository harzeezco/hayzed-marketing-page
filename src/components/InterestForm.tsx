'use client';
import { useEffect, useRef, useState } from 'react';
import { config } from '@/lib/content';
import { submitInterest, track, type InterestKind, type InterestSubmission } from '@/lib/submissions';
export function InterestForm({ kind = 'buyer' }: { kind?: InterestKind }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const started = useRef(false);
  const [connected, setConnected] = useState(false);
  const merchant = kind === 'merchant';
  useEffect(() => {
    if (merchant) return;
    let active = true;
    fetch('/api/early-access', { cache: 'no-store' })
      .then(response => response.json())
      .then(data => { if (active) setConnected(data.ready === true); })
      .catch(() => { if (active) setConnected(false); });
    return () => { active = false; };
  }, [merchant]);
  const configured = merchant ? Boolean(config.merchantEndpoint) : connected;
  function field(name: string, label: string, type = 'text', required = true, placeholder = '', full = false) {
    return <div className={full ? 'field full' : 'field'}><label htmlFor={`${kind}-${name}`}>{label}{!required && <span> (optional)</span>}</label><input id={`${kind}-${name}`} name={name} type={type} required={required} placeholder={placeholder} maxLength={name === 'phone' ? 24 : 180} autoComplete={name === 'name' ? 'name' : name === 'phone' ? 'tel' : name === 'email' ? 'email' : 'off'} pattern={name === 'phone' ? '[+0-9 ()-]{7,24}' : undefined} title={name === 'phone' ? 'Enter a phone number with 7–24 characters, including country code.' : undefined} /></div>;
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus('loading'); setError('');
    const fd = new FormData(event.currentTarget);
    const values = Object.fromEntries([...fd.entries()].map(([key,value]) => [key, String(value).trim()]));
    const data = { ...values, kind, consent: fd.get('consent') === 'on', consentVersion: '2026-10-v1' } as InterestSubmission;
    if (!data.name || !data.location || (merchant ? !data.businessName || !data.category : !data.product)) { setError('Please fill in the required fields with a little detail.'); setStatus('error'); return; }
    try { await submitInterest(data); track(merchant ? 'merchant_interest_submitted' : 'early_access_submitted'); setStatus('success'); }
    catch (e) { setError(e instanceof Error && e.name !== 'TimeoutError' && e.name !== 'TypeError' ? e.message : 'We couldn’t confirm your submission. Please check your connection and try again.'); setStatus('error'); }
  }
  if (status === 'success') return <div className="success" role="status"><span>✓</span><h3>You’re on the list.</h3><p>{merchant ? 'Thanks for telling us about your business. We’ll be in touch as our merchant research develops.' : 'We’ll let you know as we start adding products and sellers.'}</p></div>;
  return <form onSubmit={submit} onFocus={() => { if (!started.current) { track(merchant ? 'merchant_interest_started' : 'early_access_started'); started.current = true; } }}>
    {!configured && <p className="form-note">A little heads-up: online signups are being set up. For now, express your interest by <a href="mailto:hello@hayzed.com.ng">emailing us</a>. This form won’t send your details yet.</p>}
    <div className="fields">
      {field('name', merchant ? 'Owner name' : 'Your name', 'text', true, 'Your full name')}
      {merchant && field('businessName', 'Business name')}
      {field('email', 'Email address', 'email', true, 'you@example.com')}
      {field('phone', 'WhatsApp number', 'tel', true, '+234')}
      {field('location', merchant ? 'Market / location' : 'Area in Lagos', 'text', true, 'e.g. Yaba, Lagos')}
      {merchant ? <>{field('category', 'Business category')}{field('onlineChannels', 'How do you currently sell online?', 'text', false, 'e.g. WhatsApp, Instagram, or not yet', true)}</> : field('product', 'What are you looking to buy?', 'text', true, 'e.g. A blender for my kitchen', true)}
      <div className="field full"><label htmlFor={`${kind}-challenge`}>{merchant ? 'Biggest challenge finding customers' : 'What makes shopping locally difficult?'} <span>(optional)</span></label><textarea name="challenge" id={`${kind}-challenge`} rows={3} maxLength={2000} placeholder="We’d love to understand your experience." /></div>
    </div>
    <label className="consent"><input type="checkbox" name="consent" required /><span>I’d like to receive Hayzed {merchant ? 'merchant research and product' : 'product'} updates through email and WhatsApp.</span></label>
    <p className="fine">By joining, you agree to our <a href="#privacy">privacy notice</a>. You can ask us to stop contacting you at any time.</p>
    <div aria-live="polite">{status === 'error' && <p role="alert" className="error">{error}</p>}</div>
    <button className="button submit" disabled={status === 'loading' || !configured} type="submit">{status === 'loading' ? 'Sending your details…' : merchant ? 'Join as a merchant' : 'Join early access'} <span aria-hidden="true">↗</span></button>
  </form>;
}

