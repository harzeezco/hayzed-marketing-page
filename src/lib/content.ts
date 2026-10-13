export const content = {
  brand: 'Hayzed',
  email: 'hello@hayzed.com.ng',
  headline: 'Wetin you dey find for market?',
  headlineAccent: 'Let’s make the search easier.',
  intro: 'From appliances to everyday things, tell us what you need. We’re learning how Lagos markets work so your next market run can start with a better lead.',
};
export const config = {
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '',
  buyerEndpoint: '/api/early-access',
  merchantEndpoint: process.env.NEXT_PUBLIC_MERCHANT_ENDPOINT || '',
};
export function whatsappUrl() {
  const number = config.whatsappNumber.replace(/\D/g, '');
  return number ? `https://wa.me/${number}?text=${encodeURIComponent('Hello Hayzed! I’d like to learn more about early access.')}` : null;
}

