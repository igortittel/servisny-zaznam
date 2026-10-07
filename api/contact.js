import formData from 'form-data';
import Mailgun from 'mailgun.js';

const REGION = (process.env.MAILGUN_REGION || 'EU').toUpperCase();
const API_HOST = REGION === 'US' ? 'https://api.mailgun.net' : 'https://api.eu.mailgun.net';

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || '',
  url: API_HOST,
});

const escapeHtml = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// Field length caps (server-side; aligns with reasonable form expectations)
const LIMITS = {
  meno: 60, priezvisko: 60, email: 120, telefon: 40,
  spolocnost: 120, poznamka: 2000,
};

// Anti-spam: timing + rate limit
const MIN_FILL_MS = 2000;             // humans need ≥2s to fill the form
const RL_WINDOW_MS = 10 * 60 * 1000;  // 10 minutes
const RL_MAX = 3;                     // max submissions per IP per window
const rateLimitMap = new Map();       // ip → [timestamps]

const clientIp = req =>
  (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
  req.socket?.remoteAddress || 'unknown';

const silentOk = res => res.status(200).json({ success: true });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};
  const { meno, priezvisko, email, telefon, spolocnost, poznamka, website, t_start } = body;

  // --- Anti-spam layer 1: honeypot ---
  if (website && String(website).trim() !== '') {
    console.warn('[spam] honeypot filled', { ip: clientIp(req) });
    return silentOk(res);
  }

  // --- Anti-spam layer 2: timing (bots submit immediately) ---
  const started = Number(t_start);
  if (!started || Date.now() - started < MIN_FILL_MS) {
    console.warn('[spam] timing too fast', { ip: clientIp(req), delta: Date.now() - (started || 0) });
    return silentOk(res);
  }

  // --- Anti-spam layer 3: rate limit per IP ---
  const ip = clientIp(req);
  const now = Date.now();
  const hits = (rateLimitMap.get(ip) || []).filter(t => now - t < RL_WINDOW_MS);
  if (hits.length >= RL_MAX) {
    console.warn('[spam] rate limit', { ip, hits: hits.length });
    return silentOk(res);
  }
  hits.push(now);
  rateLimitMap.set(ip, hits);
  // Opportunistic cleanup — keep the map small
  if (rateLimitMap.size > 500) {
    for (const [k, v] of rateLimitMap) {
      const kept = v.filter(t => now - t < RL_WINDOW_MS);
      if (kept.length === 0) rateLimitMap.delete(k);
      else rateLimitMap.set(k, kept);
    }
  }

  if (!meno || !priezvisko || !email || !telefon) {
    return res.status(400).json({ error: 'Vyplňte prosím všetky povinné polia.' });
  }

  // --- Length caps (bots often paste huge payloads) ---
  for (const [field, max] of Object.entries(LIMITS)) {
    const v = body[field];
    if (v && String(v).length > max) {
      console.warn('[spam] length exceeded', { field, len: String(v).length });
      return silentOk(res);
    }
  }

  // --- URL count in message (classic spam signal) ---
  const urlMatches = String(poznamka || '').match(/https?:\/\/|www\./gi) || [];
  if (urlMatches.length > 2) {
    console.warn('[spam] too many URLs', { count: urlMatches.length });
    return silentOk(res);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Zadajte platnú e-mailovú adresu.' });
  }

  const domain = process.env.MAILGUN_DOMAIN;
  if (!process.env.MAILGUN_API_KEY || !domain) {
    console.error('Mailgun not configured: missing MAILGUN_API_KEY or MAILGUN_DOMAIN');
    return res.status(500).json({ error: 'Server nie je nakonfigurovaný. Skúste prosím neskôr.' });
  }

  const from = process.env.MAILGUN_FROM || `Servisný Záznam <noreply@${domain}>`;
  // MAILGUN_TO accepts a comma-separated list — all recipients receive the mail
  const to = (process.env.MAILGUN_TO || 'servisny@zaznam.sk,kanos@kanos.sk')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  const esc = {
    meno: escapeHtml(meno),
    priezvisko: escapeHtml(priezvisko),
    email: escapeHtml(email),
    telefon: escapeHtml(telefon),
    spolocnost: escapeHtml(spolocnost || ''),
    poznamka: escapeHtml(poznamka || '').replace(/\n/g, '<br>'),
  };

  const html = `
    <div style="font-family: -apple-system, Helvetica Neue, Arial, sans-serif; max-width: 600px; color: #0F0E0D;">
      <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 24px;">Nová správa z kontaktného formulára</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-size: 14px; color: #524F49; width: 140px;">Meno</td>
          <td style="padding: 8px 0; font-size: 15px;">${esc.meno} ${esc.priezvisko}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 14px; color: #524F49;">E-mail</td>
          <td style="padding: 8px 0; font-size: 15px;"><a href="mailto:${esc.email}" style="color: #0F0E0D;">${esc.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 14px; color: #524F49;">Telefón</td>
          <td style="padding: 8px 0; font-size: 15px;">${esc.telefon}</td>
        </tr>
        ${esc.spolocnost ? `<tr><td style="padding: 8px 0; font-size: 14px; color: #524F49;">Spoločnosť</td><td style="padding: 8px 0; font-size: 15px;">${esc.spolocnost}</td></tr>` : ''}
        ${esc.poznamka ? `<tr><td style="padding: 8px 0; font-size: 14px; color: #524F49; vertical-align: top;">Poznámka</td><td style="padding: 8px 0; font-size: 15px; line-height: 1.5;">${esc.poznamka}</td></tr>` : ''}
      </table>
    </div>
  `;

  try {
    await mg.messages.create(domain, {
      from,
      to,
      'h:Reply-To': email,
      subject: `Nová správa od ${meno} ${priezvisko}`,
      html,
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Mailgun send failed:', err?.status, err?.message, err?.details);
    return res.status(500).json({ error: 'Nastala chyba pri odosielaní. Skúste prosím neskôr.' });
  }
}
