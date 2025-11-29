/**
 * lib/send-token-email.ts
 * 
 * Service untuk mengirim token voting via email
 * Menggunakan nodemailer dengan SMTP Gmail
 */

import nodemailer, { Transporter } from "nodemailer";
import { config } from "dotenv";

// Load environment variables
config({ path: ".env.local" });

/**
 * HTML Template untuk email token
 */
function getTokenEmailHTML(nama: string, token: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Token Voting PEMILU GEA 2025</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #1D222F;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1D222F; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #0A0E1A; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #6B21A8 0%, #2BCAE0 100%); padding: 40px 20px; text-align: center;">
              <h1 style="margin: 0; color: #FFFFFF; font-size: 28px; font-weight: bold;">
                PEMILU GEA 2025
              </h1>
              <p style="margin: 10px 0 0 0; color: #E8D9C5; font-size: 14px;">
                May the Force Be With You
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #E8D9C5; font-size: 16px;">
                Halo <strong style="color: #E3C45E;">${nama}</strong>,
              </p>
              
              <p style="margin: 0 0 30px 0; color: #B0B0B0; font-size: 14px; line-height: 1.6;">
                Berikut adalah token voting Anda untuk <strong>PEMILU GEA 2025</strong>. 
                Token ini bersifat rahasia dan hanya dapat digunakan <strong style="color: #E3C45E;">satu kali</strong> untuk memberikan suara.
              </p>

              <!-- Token Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="background: linear-gradient(135deg, #2D1B47 0%, #1A3A4D 100%); border: 2px solid #6B21A8; border-radius: 8px; padding: 20px; text-align: center;">
                    <p style="margin: 0 0 10px 0; color: #2BCAE0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
                      Your Voting Token
                    </p>
                    <p style="margin: 0; color: #E3C45E; font-size: 18px; font-weight: bold; letter-spacing: 2px; word-break: break-all; font-family: 'Courier New', monospace;">
                      ${token}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Instructions -->
              <div style="background-color: #1D222F; border-left: 4px solid #2BCAE0; padding: 15px 20px; margin-bottom: 30px; border-radius: 4px;">
                <p style="margin: 0 0 15px 0; color: #E3C45E; font-size: 14px; font-weight: bold;">
                  📋 Cara Menggunakan Token:
                </p>
                <ol style="margin: 0; padding-left: 20px; color: #B0B0B0; font-size: 13px; line-height: 1.8;">
                  <li>Pilih tab <strong>"Login dengan Token"</strong></li>
                  <li>Salin dan paste token di atas</li>
                  <li>Klik <strong>"Login"</strong> untuk mulai voting</li>
                  <li>Pilih kandidat Kahim dan Senator favorit Anda</li>
                </ol>
              </div>

              <!-- Warning -->
              <div style="background-color: #4A1616; border-left: 4px solid #951518; padding: 15px 20px; margin-bottom: 30px; border-radius: 4px;">
                <p style="margin: 0; color: #E8D9C5; font-size: 13px; line-height: 1.6;">
                  ⚠️ <strong>PENTING:</strong><br>
                  • Token hanya dapat digunakan <strong>satu kali</strong><br>
                  • Jangan bagikan token kepada orang lain<br>
                  • Voting ditutup pada: <strong style="color: #E3C45E;">3 Desember 2025, 09:00 WIB</strong><br>
                  • Jika token hilang, hubungi panitia
                </p>
              </div>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://pemilu-gea-2025.vercel.app/auth/sign-in" 
                       style="display: inline-block; background: linear-gradient(135deg, #6B21A8 0%, #2BCAE0 100%); color: #FFFFFF; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 16px; font-weight: bold; text-align: center;">
                      🗳️ Mulai Voting Sekarang
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0A0E1A; padding: 30px 30px; text-align: center; border-top: 1px solid #2D3748;">
              <p style="margin: 0 0 10px 0; color: #6B7280; font-size: 12px;">
                PEMILU GEA 2025 - Gerakan Eskalasi Aspirasi
              </p>
              <p style="margin: 0 0 15px 0; color: #6B7280; font-size: 12px;">
                📧 geapemilu@gmail.com | 
                📱 <a href="https://wa.me/6281315763302" style="color: #2BCAE0; text-decoration: none;">+62 813-1576-3302</a>
              </p>
              <p style="margin: 0; color: #4B5563; font-size: 11px; font-style: italic;">
                "May the Force Be With You"
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Plain text version (fallback)
 */
function getTokenEmailText(nama: string, token: string): string {
  return `
PEMILU GEA 2025 - Token Voting

Halo ${nama},

Berikut adalah token voting Anda untuk PEMILU GEA 2025:

TOKEN: ${token}

Cara Menggunakan:
1. Kunjungi Tempat Voting atau Hubungi Panitia
2. Pilih tab "Login dengan Token"
3. Paste token di atas
4. Klik "Login" untuk mulai voting

PENTING:
- Token hanya dapat digunakan SATU KALI
- Jangan bagikan token kepada orang lain
- Voting ditutup: 5 Desember 2025

Terima kasih atas partisipasi Anda!

---
PEMILU GEA 2025
Email: geapemilu@gmail.com
WhatsApp: +62 813-1576-3302
  `.trim();
}

/**
 * Create SMTP transporter
 */
export function createEmailTransporter(): Transporter {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: true,
    port: 465,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  return transporter;
}

/**
 * Send token email dengan retry mechanism
 */
export async function sendTokenEmail(
  transporter: Transporter,
  email: string,
  nama: string,
  token: string,
  retries = 3
): Promise<{ success: boolean; error?: string }> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      await transporter.sendMail({
        from: `"PEMILU GEA 2025" <${process.env.EMAIL_FROM || process.env.EMAIL}>`,
        to: email,
        subject: "🗳️ Token Voting PEMILU GEA 2025",
        text: getTokenEmailText(nama, token),
        html: getTokenEmailHTML(nama, token),
      });

      console.log(`✅ Email sent to: ${email} (${nama})`);
      return { success: true };
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.log(`⚠️  Attempt ${attempt + 1}/${retries} failed for ${email}: ${errorMessage}`);

      if (attempt === retries - 1) {
        console.error(`❌ Failed to send email to ${email} after ${retries} attempts`);
        return { success: false, error: errorMessage };
      }

      // Delay before retry (exponential backoff)
      const delayMs = 2000 * Math.pow(2, attempt); // 2s, 4s, 8s
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return { success: false, error: "Unknown error" };
}

/**
 * Verify SMTP connection
 */
export async function verifyEmailConnection(transporter: Transporter): Promise<boolean> {
  return new Promise((resolve) => {
    transporter.verify((error, _success) => {
      if (error) {
        console.error("❌ SMTP Server verification failed:", error.message);
        resolve(false);
      } else {
        console.log("✅ SMTP Server is ready", _success);
        resolve(true);
      }
    });
  });
}
