const nodemailer = require("nodemailer");

// Credentials with cloud deployment fallbacks
const EMAIL_USER =
  process.env.EMAIL_USER || "lahyavennapusa0104@gmail.com";
const EMAIL_PASS =
  process.env.EMAIL_PASS || "mkivvexzfzinbndm";
const EMAIL_HOST =
  process.env.EMAIL_HOST || "smtp.gmail.com";
const EMAIL_FROM =
  process.env.EMAIL_FROM || `Comparely Support <${EMAIL_USER}>`;

// Primary Transporter: Direct SSL (Port 465) with connection pooling
const primaryTransporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: 465,
  secure: true,
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  rateDelta: 1000,
  rateLimit: 5,
  connectionTimeout: 8000,
  greetingTimeout: 8000,
  socketTimeout: 10000,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Fallback Transporter: STARTTLS (Port 587) in case cloud provider restricts port 465
const fallbackTransporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: 587,
  secure: false,
  connectionTimeout: 8000,
  greetingTimeout: 8000,
  socketTimeout: 10000,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

async function verifyEmailTransporter() {
  console.log(`[EMAIL] Verifying SMTP connection to ${EMAIL_HOST} as ${EMAIL_USER}...`);
  try {
    await primaryTransporter.verify();
    console.log("[EMAIL] Primary SMTP connection (SSL 465) verified successfully.");
    return true;
  } catch (err) {
    console.warn("[EMAIL] Primary SMTP connection failed, verifying fallback (587)...", err.message);
    try {
      await fallbackTransporter.verify();
      console.log("[EMAIL] Fallback SMTP connection (587) verified successfully.");
      return true;
    } catch (fallbackErr) {
      console.error("[EMAIL] All SMTP connection verifications failed:", fallbackErr.message);
      return false;
    }
  }
}

async function sendEmail({ to, subject, html, priority = "high", headers = {} }) {
  if (!to) {
    throw new Error("Recipient email is missing.");
  }

  const mailOptions = {
    from: EMAIL_FROM,
    to: to.trim(),
    subject,
    html,
    priority,
    headers: {
      "X-Priority": priority === "high" ? "1" : "3",
      "X-MSMail-Priority": priority === "high" ? "High" : "Normal",
      Importance: priority === "high" ? "High" : "Normal",
      ...headers,
    },
  };

  try {
    const info = await primaryTransporter.sendMail(mailOptions);
    console.log(`[EMAIL] Delivered "${subject}" to ${to} (Message ID: ${info.messageId})`);
    return info;
  } catch (primaryErr) {
    console.warn(`[EMAIL] Primary transport failed (${primaryErr.message}). Retrying via port 587...`);
    try {
      const info = await fallbackTransporter.sendMail(mailOptions);
      console.log(`[EMAIL] Delivered via port 587 to ${to} (Message ID: ${info.messageId})`);
      return info;
    } catch (fallbackErr) {
      console.error(`[EMAIL] Delivery failed to ${to}:`, fallbackErr.message);
      throw fallbackErr;
    }
  }
}

module.exports = sendEmail;
module.exports.verifyEmailTransporter = verifyEmailTransporter;
