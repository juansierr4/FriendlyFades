const functions = require('firebase-functions');
const admin = require('firebase-admin');
const twilio = require('twilio');

admin.initializeApp();

// Example Twilio setup
const accountSid = 'YOUR_TWILIO_ACCOUNT_SID'; // Add your Twilio account SID here
const authToken = 'YOUR_TWILIO_AUTH_TOKEN'; // Add your Twilio auth token here
const client = new twilio(accountSid, authToken);

exports.sendVerificationCode = functions.https.onRequest(async (req, res) => {
  const { phoneNumber } = req.body; // Extract phone number from request body

  // Generate a secure verification code
  const verificationCode = generateVerificationCode();

  try {
    await client.messages.create({
      body: `Your verification code is: ${verificationCode}`,
      to: phoneNumber, // Text this number
      from: 'YOUR_TWILIO_PHONE_NUMBER', // From a valid Twilio number
    });

    // Optionally store the verification code in your database associated with the phone number for verification later

    res.status(200).send({ message: 'Verification code sent successfully.' });
  } catch (error) {
    console.error('Error sending verification code:', error);
    res.status(500).send({ error: 'Failed to send verification code' });
  }
});

function generateVerificationCode() {
  // Ensure this function generates a code suitable for your needs
  const verificationCode = Math.floor(100000 + Math.random() * 900000); // 6 digit code
  return verificationCode.toString();
}
