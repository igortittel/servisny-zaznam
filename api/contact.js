import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { meno, priezvisko, email, telefon, spolocnost, poznamka } = req.body;

  if (!meno || !priezvisko || !email || !telefon) {
    return res.status(400).json({ error: 'Vyplňte prosím všetky povinné polia.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Zadajte platnú e-mailovú adresu.' });
  }

  try {
    await resend.emails.send({
      from: 'Servisný Záznam <noreply@servisnyzaznam.sk>',
      to: 'servisny@zaznam.sk',
      replyTo: email,
      subject: `Nová správa od ${meno} ${priezvisko}`,
      html: `
        <div style="font-family: -apple-system, Helvetica Neue, Arial, sans-serif; max-width: 600px; color: #0F0E0D;">
          <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 24px;">Nová správa z kontaktného formulára</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-size: 14px; color: #524F49; width: 140px;">Meno</td>
              <td style="padding: 8px 0; font-size: 15px;">${meno} ${priezvisko}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-size: 14px; color: #524F49;">E-mail</td>
              <td style="padding: 8px 0; font-size: 15px;"><a href="mailto:${email}" style="color: #0F0E0D;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-size: 14px; color: #524F49;">Telefón</td>
              <td style="padding: 8px 0; font-size: 15px;">${telefon}</td>
            </tr>
            ${spolocnost ? `<tr><td style="padding: 8px 0; font-size: 14px; color: #524F49;">Spoločnosť</td><td style="padding: 8px 0; font-size: 15px;">${spolocnost}</td></tr>` : ''}
            ${poznamka ? `<tr><td style="padding: 8px 0; font-size: 14px; color: #524F49; vertical-align: top;">Poznámka</td><td style="padding: 8px 0; font-size: 15px; line-height: 1.5;">${poznamka.replace(/\n/g, '<br>')}</td></tr>` : ''}
          </table>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch {
    return res.status(500).json({ error: 'Nastala chyba pri odosielaní. Skúste prosím neskôr.' });
  }
}
