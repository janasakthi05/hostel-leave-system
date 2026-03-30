let client = null;

if (process.env.TWILIO_SID && process.env.TWILIO_SID.startsWith("AC")) {
  const twilio = require("twilio");
  client = twilio(
    process.env.TWILIO_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

const sendSMS = async (mobile, message) => {
  try {
    if (!mobile) {
      console.log("❌ Parent mobile missing");
      return;
    }

    if (!client) {
      console.log("⚠️ Twilio not configured, skipping SMS");
      return;
    }

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: `+91${mobile}`
    });

    console.log("✅ SMS sent via Twilio to", mobile);
  } catch (error) {
    console.log("❌ Twilio SMS failed:", error.message);
  }
};

module.exports = sendSMS;