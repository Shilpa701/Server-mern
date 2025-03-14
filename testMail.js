import {sendOtp} from './controller/utils/emailService.js';// Update the path accordingly

const testMail = async () => {
  try {
    await sendOtp('test@example.com', '123456');
    console.log('✅ Email sent successfully!');
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
  }
};

testMail();