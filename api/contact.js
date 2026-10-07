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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { meno, priezvisko, email, telefon, spolocnost, poznamka } = req.body || {};

  if (!meno || !priezvisko || !email || !telefon) {
    return res.status(400).json({ error: 'Vyplňte prosím všetky povinné polia.' });
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
  const to = process.env.MAILGUN_TO || 'servisny@zaznam.sk';

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
      to: [to],
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
