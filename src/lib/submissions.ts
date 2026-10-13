import { config } from './content';
export type InterestKind = 'buyer' | 'merchant';
export interface InterestSubmission {
  kind: InterestKind; name: string; email: string; phone: string; location: string;
  product?: string; challenge?: string; businessName?: string; category?: string;
  onlineChannels?: string; consent: boolean; consentVersion: '2026-10-v1';
}
export type AnalyticsEvent = 'early_access_started' | 'early_access_submitted' | 'merchant_interest_started' | 'merchant_interest_submitted' | 'whatsapp_clicked';
export function track(event: AnalyticsEvent) {
  // An analytics adapter can subscribe without receiving contact or research data.
  window.dispatchEvent(new CustomEvent('hayzed:analytics', { detail: { event } }));
}
export async function submitInterest(data: InterestSubmission): Promise<void> {
  const endpoint = data.kind === 'buyer' ? config.buyerEndpoint : config.merchantEndpoint;
  if (!endpoint) throw new Error('Online signups aren’t open yet. Your details have not been sent. Please email hello@hayzed.com.ng to express interest.');
  const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), signal: AbortSignal.timeout(35000) });
  if (response.status === 400) throw new Error('Please check your email, WhatsApp number, and other required details.');
  if (response.status === 403) throw new Error('Please refresh the page and try again.');
  if (!response.ok) throw new Error('We couldn’t save your details. Please try again or contact us by email.');
}
