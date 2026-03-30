const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendSMS = async (mobile, message) => {
  try {
    if (!mobile) {
      console.log("❌ Parent mobile missing");
      return;
    }

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: `+91${mobile}` // India country code
    });

    console.log("✅ SMS sent via Twilio to", mobile);
  } catch (error) {
    console.log("❌ Twilio SMS failed:", error.message);
  }
};

module.exports = sendSMS;
