import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_SECURE !== 'false',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: { rejectUnauthorized: false }
});

async function sendTest() {
    console.log('--- SMTP Real Send Test ---');
    console.log('User:', process.env.SMTP_USER);

    const mailOptions = {
        from: `"${process.env.FROM_NAME || 'FoodCart Test'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER, // Send to self for testing
        subject: '🧪 FoodCart: Real Email Send Test',
        text: 'This is a test email to verify that sending actually works, not just the connection verify.',
        html: '<b>This is a test email to verify that sending actually works, not just the connection verify.</b>'
    };

    try {
        console.log('Sending email...');
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ SUCCESS! Email sent.');
        console.log('Message ID:', info.messageId);
        console.log('Response:', info.response);
    } catch (error) {
        console.error('❌ FAILED to send email.');
        console.error(error);
    }
}

sendTest();
