import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure we load the .env file from the server directory
dotenv.config({ path: join(__dirname, '.env') });

console.log('--- SMTP Debug Script ---');
console.log('User:', process.env.SMTP_USER);
// Mask the password for security in logs
console.log('Pass:', process.env.SMTP_PASS ? `${process.env.SMTP_PASS.substring(0, 3)}... (length: ${process.env.SMTP_PASS.length})` : 'NOT SET');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Connection Failed!');
        console.error(error);
    } else {
        console.log('✅ Connection Sucess! Ready to send emails.');
    }
});
