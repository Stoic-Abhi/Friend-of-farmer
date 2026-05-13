// src/config/otp-delivery.js
// OTP dispatch — email (nodemailer) + SMS (Twilio) with console fallback in dev.
//
// In development, OTPs are printed to the console.
// In production, configure SMTP_* and TWILIO_* env vars.

const isDev = (process.env.NODE_ENV ?? 'development') === 'development';

/**
 * Detect whether the identifier is an email or phone number.
 * @param {string} identifier
 * @returns {'email' | 'sms'}
 */
function channel(identifier) {
  return identifier.includes('@') ? 'email' : 'sms';
}

/**
 * Send OTP via email (nodemailer).
 * Falls back to console in dev or if SMTP is not configured.
 */
async function sendEmail(identifier, otp) {
  if (isDev || !process.env.SMTP_HOST) {
    console.info(`📧 [DEV] OTP for ${identifier}: ${otp}`);
    return;
  }

  // Dynamic import so nodemailer is only required when actually configured
  const nodemailer = await import('nodemailer');
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from:    process.env.SMTP_FROM ?? 'noreply@farmdirect.in',
    to:      identifier,
    subject: 'FarmDirect — Your OTP Code',
    text:    `Your FarmDirect verification code is: ${otp}\n\nThis code expires in 5 minutes.`,
    html:    `<p>Your FarmDirect verification code is: <strong>${otp}</strong></p><p>This code expires in 5 minutes.</p>`,
  });
}

/**
 * Send OTP via SMS (Twilio).
 * Falls back to console in dev or if Twilio is not configured.
 */
async function sendSMS(identifier, otp) {
  if (isDev || !process.env.TWILIO_ACCOUNT_SID) {
    console.info(`📱 [DEV] OTP for ${identifier}: ${otp}`);
    return;
  }

  // Dynamic import so twilio is only required when actually configured
  const twilio = await import('twilio');
  const client = twilio.default(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN,
  );

  await client.messages.create({
    body: `FarmDirect: Your verification code is ${otp}. Expires in 5 minutes.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to:   identifier,
  });
}

/**
 * Dispatch OTP to the appropriate channel.
 * @param {string} identifier - email address or phone number
 * @param {string} otp        - plain-text OTP code
 */
export async function dispatchOtp(identifier, otp) {
  if (channel(identifier) === 'email') {
    await sendEmail(identifier, otp);
  } else {
    await sendSMS(identifier, otp);
  }
}
