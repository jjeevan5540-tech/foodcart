import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

const user = process.env.SMTP_USER;
// The password currently in .env (no spaces)
const passNoSpaces = process.env.SMTP_PASS;
// The password with spaces (as user might have copied)
const passWithSpaces = 'thxr asts ycne dbsl';

async function test(port, secure, password, label) {
    console.log(`\n\n--- Testing ${label} ---`);
    console.log(`Host: smtp.gmail.com | Port: ${port} | Secure: ${secure}`);
    console.log(`User: ${user}`);
    console.log(`Pass: ${password.substring(0, 4)}... (len: ${password.length})`);

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port,
        secure,
        auth: {
            user,
            pass: password
        },
        tls: { rejectUnauthorized: false }
    });

    try {
        await transporter.verify();
        console.log('✅ SUCCESS! This configuration works.');
        return true;
    } catch (err) {
        console.error('❌ FAILED.');
        if (err.responseCode) console.error('Response Code:', err.responseCode);
        if (err.response) console.error('Response:', err.response);
        else console.error(err);
        return false;
    }
}

async function run() {
    console.log('Starting comprehensive SMTP diagnostics...');

    // 1. Try current config (465, SSL, No Spaces)
    if (await test(465, true, passNoSpaces, 'Port 465 (SSL) - No Spaces')) return;

    // 2. Try TLS config (587, TLS, No Spaces)
    if (await test(587, false, passNoSpaces, 'Port 587 (TLS) - No Spaces')) return;

    // 3. Try current config WITH SPACES
    if (await test(465, true, passWithSpaces, 'Port 465 (SSL) - With Spaces')) return;

    console.log('\n\n❌ All attempts failed. Please check the credentials.');
}

run();
