'use client';
import { whatsappUrl } from '@/lib/content';
import { track } from '@/lib/submissions';
export function WhatsAppCTA() {
  const url = whatsappUrl();
  return url ? <a className="chat" href={url} target="_blank" rel="noopener noreferrer" onClick={() => track('whatsapp_clicked')}>Chat with Hayzed ↗</a> : <a className="chat" href="mailto:hello@hayzed.com.ng">Email Hayzed ↗</a>;
}
