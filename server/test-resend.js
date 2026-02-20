import { Resend } from 'resend';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testResend() {
    console.log('--- Resend Integration Test ---');
    console.log('API Key present:', !!process.env.RESEND_API_KEY);

    try {
        const { data, error } = await resend.emails.send({
            from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
            to: process.env.SMTP_USER || 'jjeevan5540@gmail.com',
            subject: '🧪 FoodCart: Resend Integration Test',
            html: '<b>Resend integration is working perfectly! ✅</b>'
        });

        if (error) {
            console.error('❌ Resend FAILED:', error);
        } else {
            console.log('✅ SUCCESS! Email sent via Resend.');
            console.log('Result:', data);
        }
    } catch (err) {
        console.error('❌ Error testing Resend:', err.message);
    }
}

testResend();
