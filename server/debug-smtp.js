import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465');
const SMTP_SECURE = process.env.SMTP_SECURE !== 'false';
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';

console.log('--- Configuration ---');
console.log('Host:', SMTP_HOST);
console.log('Port:', SMTP_PORT);
console.log('Secure:', SMTP_SECURE);
console.log('User:', SMTP_USER);
console.log('Pass Length:', SMTP_PASS.length);

const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    tls: { rejectUnauthorized: false },
});

transporter.verify((err, ok) => {
    if (err) {
        console.error('❌ SMTP verification failed!');
        console.error('Message:', err.message);
        console.error('Stack:', err.stack);
        process.exit(1);
    } else {
        console.log('✅ SMTP verification successful!');
        process.exit(0);
    }
});
