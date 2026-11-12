const dns = require("dns");
try {
  dns.setDefaultResultOrder("ipv4first");
} catch (_) {}

const axios = require("axios");
const nodemailer = require("nodemailer");

// Brevo (Sendinblue) Configuration
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_SENDER_EMAIL =
  process.env.BREVO_SENDER_EMAIL || "bussamohanteja@gmail.com";
const BREVO_SENDER_NAME =
  process.env.BREVO_SENDER_NAME || "Comparely";

// Fallback SMTP Transporter (in case API is unavailable)
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_HOST = process.env.EMAIL_HOST || "smtp.gmail.com";
const EMAIL_FROM =
  process.env.EMAIL_FROM || `${BREVO_SENDER_NAME} <${BREVO_SENDER_EMAIL}>`;

let fallbackTransporter = null;
function getFallbackTransporter() {
  if (!fallbackTransporter) {
    fallbackTransporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: 465,
      secure: true,
      pool: true,
      connectionTimeout: 8000,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });
  }
  return fallbackTransporter;
}

/**
 * Verify Brevo API connection on server boot
 */
async function verifyEmailTransporter() {
  console.log(`[EMAIL] Verifying Brevo API connection...`);
  try {
    const res = await axios.get("https://api.brevo.com/v3/account", {
      headers: {
        "api-key": BREVO_API_KEY,
        accept: "application/json",
      },
      timeout: 8000,
    });

    const email = res.data?.email || BREVO_SENDER_EMAIL;
    const plan = res.data?.plan?.[0];
    const credits = plan?.credits !== undefined ? plan.credits : "active";
    console.log(
      `[EMAIL] Brevo API verified successfully (Account: ${email}, Credits: ${credits}).`
    );
    return true;
  } catch (err) {
    const errorMsg =
      err.response?.data?.message || err.message || "Unknown error";
    console.warn(`[EMAIL] Brevo API verification failed: ${errorMsg}. Fallback SMTP will be used if needed.`);
    return false;
  }
}

/**
 * Send Transactional Email using Brevo REST API over HTTPS
 * with automatic fallback to SMTP
 */
async function sendEmail({ to, subject, html, priority = "high", headers = {} }) {
  if (!to) {
    throw new Error("Recipient email is missing.");
  }

  const recipientEmail = String(to).trim();

  // 1. Primary: Send via Brevo HTTPS REST API (Port 443 - Never blocked on Render/cloud)
  if (BREVO_API_KEY) {
    try {
      const payload = {
        sender: {
          name: BREVO_SENDER_NAME,
          email: BREVO_SENDER_EMAIL,
        },
        to: [
          {
            email: recipientEmail,
          },
        ],
        subject,
        htmlContent: html,
        headers: {
          "X-Priority": priority === "high" ? "1" : "3",
          Importance: priority === "high" ? "High" : "Normal",
          ...headers,
        },
      };

      const response = await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        payload,
        {
          headers: {
            "api-key": BREVO_API_KEY,
            "content-type": "application/json",
            accept: "application/json",
          },
          timeout: 10000,
        }
      );

      const messageId = response.data?.messageId || "brevo-" + Date.now();
      console.log(
        `[BREVO] Delivered "${subject}" to ${recipientEmail} (Message ID: ${messageId})`
      );

      return {
        success: true,
        messageId,
        provider: "brevo",
      };
    } catch (brevoErr) {
      const errDetails =
        brevoErr.response?.data?.message || brevoErr.message;
      console.warn(
        `[BREVO] API send failed (${errDetails}). Attempting fallback SMTP...`
      );
    }
  }

  // 2. Fallback: Send via Nodemailer SMTP
  try {
    const transporter = getFallbackTransporter();
    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to: recipientEmail,
      subject,
      html,
      priority,
      headers: {
        "X-Priority": priority === "high" ? "1" : "3",
        "X-MSMail-Priority": priority === "high" ? "High" : "Normal",
        Importance: priority === "high" ? "High" : "Normal",
        ...headers,
      },
    });

    console.log(
      `[SMTP] Delivered "${subject}" to ${recipientEmail} via fallback (Message ID: ${info.messageId})`
    );
    return {
      success: true,
      messageId: info.messageId,
      provider: "smtp",
    };
  } catch (smtpErr) {
    console.error(
      `[EMAIL] Both Brevo and fallback SMTP failed for ${recipientEmail}:`,
      smtpErr.message
    );
    throw new Error(`Email delivery failed: ${smtpErr.message}`);
  }
}

module.exports = sendEmail;
module.exports.verifyEmailTransporter = verifyEmailTransporter;
