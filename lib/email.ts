import nodemailer, { Transporter } from "nodemailer";
// import dataEmailNone from "@/db/seed/data-email-none.json";

import { config } from "dotenv";
import { emailHTML } from "./html";

config({ path: ".env.local" });

const dataEmailInvalid = [
  {
    email: "ridonta123456789@gmail.com",
    token: "IZ4OPZZV",
  },
  {
    email: "detyaamanda13@gmail.com",
    token: "D0HG7VBV",
  },
  {
    email: "akmalidm548@gmail.com",
    token: "WAPKZ4F9",
  },
  {
    email: "fathurrhmn152003@gmail.com",
    token: "4MVTZKUH",
  },
];

async function sendEmail(
  transporter: Transporter,
  recipient: string,
  token: string,
  retries = 3,
) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: recipient,
        subject: "Token Voting Pemilu GEA 2024",
        html: emailHTML(token),
      });
      console.log(`Email sent to: ${recipient}`);
      return;
    } catch (error) {
      console.log(
        `Attempt ${attempt + 1} failed for ${recipient}: ${(error as Error).message}`,
      );
      if (attempt === retries - 1) {
        console.log(
          `Failed to send email to ${recipient} after ${retries} attempts.`,
        );
      } else {
        // Delay before retrying
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds
      }
    }
  }
}

async function main() {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: true,
    port: 465,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  transporter.verify((error, success) => {
    if (error) {
      console.error("SMTP Server verification failed:", error);
      process.exit(1);
    } else {
      console.log("SMTP Server is ready:", success);
    }
  });

  for (const { email, token } of dataEmailInvalid) {
    await sendEmail(transporter, email, token); // Wait for each email to send
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay between emails
  }
}

main().catch(console.error);
