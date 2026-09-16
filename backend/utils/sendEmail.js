const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function verifyEmailTransporter() {
  console.log("======================================");
  console.log("📧 Checking SMTP connection...");
  console.log("Host:", process.env.EMAIL_HOST);
  console.log("Port:", process.env.EMAIL_PORT);
  console.log("Email:", process.env.EMAIL_USER);
  console.log("======================================");

  try {
    await transporter.verify();
    console.log("======================================");
    console.log("✅ EMAIL SMTP CONNECTION SUCCESSFUL");
    console.log("======================================");
    return true;
  } catch (error) {
    console.error("======================================");
    console.error("❌ EMAIL SMTP CONNECTION FAILED");
    console.error("Error:", error.message);
    console.error("======================================");
    return false;
  }
}

async function sendEmail({ to, subject, html }) {
  if (!to) {
    throw new Error("Recipient email is missing.");
  }

  console.log("======================================");
  console.log("📧 SENDING EMAIL");
  console.log("To:", to);
  console.log("Subject:", subject);
  console.log("======================================");

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html,
    });

    console.log("======================================");
    console.log("✅ EMAIL SENT SUCCESSFULLY");
    console.log("To:", to);
    console.log("Message ID:", info.messageId);
    console.log("======================================");

    return info;
  } catch (error) {
    console.error("======================================");
    console.error("❌ EMAIL SEND FAILED");
    console.error("To:", to);
    console.error("Error:", error.message);
    console.error("======================================");
    throw error;
  }
}

module.exports = sendEmail;
module.exports.verifyEmailTransporter = verifyEmailTransporter;
