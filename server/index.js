import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import https from 'https';
import Razorpay from 'razorpay';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from server/ directory regardless of where node is run from
dotenv.config({ path: join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  console.log(`📡 [${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

const PORT = process.env.PORT || 5002;

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret',
});

// ─── Nodemailer Transporter ───────────────────────────────────────────────────
const createTransporter = () => {
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();

  if (!user || !pass) {
    console.error('❌ SMTP Configuration Missing: Check your .env for SMTP_USER and SMTP_PASS');
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: { user, pass },
    tls: {
      rejectUnauthorized: false // Helps with some self-signed certificate issues or proxy blocks
    }
  });
};

// ─── Helper: Send Email ───────────────────────────────────────────────────────
const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();
  console.log(`📡 Attempting to send email to ${to}...`);
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
      html,
    });
    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ SMTP Error sending to ${to}:`, error);
    // Log more details for 535 errors
    if (error.responseCode === 535) {
      console.error('⚠️  Authentication Failed (535). Please verify SMTP_USER and SMTP_PASS (App Password) in .env');
    }
    throw error;
  }
};

// ─── Helper: Send WhatsApp via CallMeBot ─────────────────────────────────────
const sendWhatsApp = (phone, message) => {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.CALLMEBOT_API_KEY || 'placeholder_key';
    const encodedMsg = encodeURIComponent(message);
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodedMsg}&apikey=${apiKey}`;

    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`✅ WhatsApp sent to ${phone}`);
        resolve(data);
      });
    }).on('error', (err) => {
      console.error(`❌ WhatsApp error: ${err.message}`);
      reject(err);
    });
  });
};

// ─── Route: Generic Email Send ────────────────────────────────────────────────
app.post('/api/send-email', async (req, res) => {
  const { to, subject, text, html } = req.body;
  if (!to || !subject) return res.status(400).json({ error: 'Missing required fields' });
  try {
    const info = await sendEmail({ to, subject, html, text });
    res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('SMTP Error:', error);
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});

// ─── Route: Login Notification ────────────────────────────────────────────────
app.post('/api/notify-login', async (req, res) => {
  const { email, name } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
      <div style="background: linear-gradient(135deg, #e23744, #ff6b35); padding: 40px 32px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 900;">🍔 FoodKart</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px;">Welcome Back!</p>
      </div>
      <div style="padding: 40px 32px;">
        <h2 style="color: #1a1a1a; font-size: 24px; margin: 0 0 16px;">Hi ${name || email.split('@')[0]} 👋</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">You have successfully logged into your <strong>FoodKart</strong> account.</p>
        <div style="background: #fff8f0; border-left: 4px solid #e23744; padding: 16px 20px; border-radius: 8px; margin: 24px 0;">
          <p style="margin: 0; color: #333; font-size: 14px;">🔒 <strong>Security Notice:</strong> If this wasn't you, please contact us immediately at <a href="mailto:jjeevan5540@gmail.com" style="color: #e23744;">jjeevan5540@gmail.com</a> or call <a href="tel:8978925540" style="color: #e23744;">8978925540</a>.</p>
        </div>
        <p style="color: #555; font-size: 15px;">Explore restaurants, discover new dishes, and enjoy fast delivery! 🚀</p>
      </div>
      <div style="background: #f8f8f8; padding: 24px 32px; text-align: center; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 13px; margin: 0;">© 2025 FoodKart | Customer Care: <a href="tel:8978925540" style="color: #e23744;">8978925540</a> | <a href="mailto:jjeevan5540@gmail.com" style="color: #e23744;">jjeevan5540@gmail.com</a></p>
      </div>
    </div>`;

  try {
    await sendEmail({ to: email, subject: '✅ FoodKart Login Successful', html });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Login notification error:', error);
    res.status(500).json({ error: 'Failed to send login notification', details: error.message });
  }
});

// ─── Route: Order Notification (Customer + Restaurant) ───────────────────────
app.post('/api/notify-order', async (req, res) => {
  const { orderData, userData } = req.body;
  if (!orderData || !userData) return res.status(400).json({ error: 'Missing order or user data' });

  const itemsList = orderData.items.map(i =>
    `<tr><td style="padding:8px 0; color:#333;">${i.name}</td><td style="padding:8px 0; color:#555; text-align:center;">x${i.quantity}</td><td style="padding:8px 0; color:#e23744; text-align:right; font-weight:bold;">₹${i.price * i.quantity}</td></tr>`
  ).join('');

  const itemsText = orderData.items.map(i => `• ${i.name} x${i.quantity} = ₹${i.price * i.quantity}`).join('\n');

  const deliveryFee = 40;
  const platformFee = 20;
  const taxes = Math.round(orderData.total * 0.05);
  const grandTotal = orderData.total + deliveryFee + platformFee + taxes;

  // ── Customer Email ──
  const customerHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
      <div style="background: linear-gradient(135deg, #e23744, #ff6b35); padding: 40px 32px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 900;">🍔 FoodKart</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 18px;">Order Confirmed! 🎉</p>
      </div>
      <div style="padding: 40px 32px;">
        <h2 style="color: #1a1a1a; margin: 0 0 16px;">Hi ${userData.name || userData.email.split('@')[0]}! 👋</h2>
        <div style="background: #fff5f5; border-radius: 12px; padding: 20px; border: 1px solid #fed7d7; margin-bottom: 24px; text-align: center;">
          <p style="color: #e23744; font-size: 20px; font-weight: 900; margin: 0;">Thank you for placing your order with FoodKart!</p>
          <p style="color: #666; font-size: 14px; margin-top: 8px;">We've received your order and our restaurant partner is starting to prepare it right away.</p>
        </div>
        <p style="color: #555; margin: 0 0 24px;">Your order <strong>#${orderData.id?.slice(-8).toUpperCase()}</strong> has been placed successfully.</p>
        
        <div style="background: #f9f9f9; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <h3 style="margin: 0 0 16px; color: #333; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">📋 Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead><tr>
              <th style="text-align:left; color:#999; font-size:12px; padding-bottom:8px; border-bottom:1px solid #eee;">ITEM</th>
              <th style="text-align:center; color:#999; font-size:12px; padding-bottom:8px; border-bottom:1px solid #eee;">QTY</th>
              <th style="text-align:right; color:#999; font-size:12px; padding-bottom:8px; border-bottom:1px solid #eee;">PRICE</th>
            </tr></thead>
            <tbody>${itemsList}</tbody>
          </table>
          <div style="border-top: 1px dashed #ddd; margin-top: 16px; padding-top: 16px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;"><span style="color:#666;">Subtotal</span><span>₹${orderData.total}</span></div>
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;"><span style="color:#666;">Delivery Fee</span><span>₹${deliveryFee}</span></div>
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;"><span style="color:#666;">Platform Fee</span><span>₹${platformFee}</span></div>
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;"><span style="color:#666;">GST & Charges</span><span>₹${taxes}</span></div>
            <div style="display:flex; justify-content:space-between; margin-top:12px; padding-top:12px; border-top:2px solid #e23744;"><strong style="font-size:18px;">Grand Total</strong><strong style="font-size:18px; color:#e23744;">₹${grandTotal}</strong></div>
          </div>
        </div>

        <div style="background: #f0fdf4; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
          <p style="margin:0; color:#166534; font-size:14px;">📍 <strong>Delivery Address:</strong> ${orderData.address}</p>
        </div>
        <div style="background: #fff8f0; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
          <p style="margin:0; color:#92400e; font-size:14px;">⏱️ <strong>Estimated Delivery:</strong> 35 - 45 Minutes</p>
        </div>
        <div style="background: #f0f9ff; border-radius: 12px; padding: 16px 20px;">
          <p style="margin:0; color:#0369a1; font-size:14px;">💳 <strong>Payment:</strong> ${orderData.paymentMethod || 'Online Payment'}</p>
        </div>
      </div>
      <div style="background: #f8f8f8; padding: 24px 32px; text-align: center; border-top: 1px solid #eee;">
        <p style="color:#555; font-size:14px; margin:0 0 8px;">Need help? Contact us:</p>
        <p style="color: #999; font-size: 13px; margin: 0;">📞 <a href="tel:8978925540" style="color: #e23744;">8978925540</a> | ✉️ <a href="mailto:jjeevan5540@gmail.com" style="color: #e23744;">jjeevan5540@gmail.com</a></p>
      </div>
    </div>`;

  // ── Restaurant Owner Email ──
  const restaurantName = orderData.items[0]?.restaurantName || 'FoodKart Restaurant';
  const ownerHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
      <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 40px 32px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 900;">🍽️ New Order Received!</h1>
        <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0;">Restaurant: ${restaurantName}</p>
      </div>
      <div style="padding: 40px 32px;">
        <div style="background: #fef3c7; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
          <p style="margin:0; color:#92400e; font-size:16px; font-weight:bold;">🆕 Order #${orderData.id?.slice(-8).toUpperCase()}</p>
          <p style="margin:4px 0 0; color:#78350f; font-size:13px;">${new Date(orderData.date).toLocaleString('en-IN')}</p>
        </div>

        <h3 style="color:#333; margin:0 0 16px;">📋 Items to Prepare:</h3>
        <table style="width:100%; border-collapse:collapse; background:#f9f9f9; border-radius:12px; overflow:hidden;">
          <thead><tr style="background:#e23744;">
            <th style="padding:12px 16px; color:white; text-align:left;">Item</th>
            <th style="padding:12px 16px; color:white; text-align:center;">Qty</th>
            <th style="padding:12px 16px; color:white; text-align:right;">Price</th>
          </tr></thead>
          <tbody>${itemsList}</tbody>
        </table>
        <div style="text-align:right; margin-top:12px; font-size:18px; font-weight:bold; color:#e23744;">Total: ₹${grandTotal}</div>

        <div style="background:#f0fdf4; border-radius:12px; padding:16px 20px; margin-top:24px;">
          <p style="margin:0; color:#166534; font-size:14px;">👤 <strong>Customer:</strong> ${userData.name || 'N/A'}</p>
          <p style="margin:6px 0 0; color:#166534; font-size:14px;">📞 <strong>Phone:</strong> ${userData.phone || 'Not provided'}</p>
          <p style="margin:6px 0 0; color:#166534; font-size:14px;">✉️ <strong>Email:</strong> ${userData.email}</p>
          <p style="margin:6px 0 0; color:#166534; font-size:14px;">📍 <strong>Delivery Address:</strong> ${orderData.address}</p>
          <p style="margin:6px 0 0; color:#166534; font-size:14px;">💳 <strong>Payment:</strong> ${orderData.paymentMethod || 'Online Payment'}</p>
        </div>
      </div>
      <div style="background:#f8f8f8; padding:24px 32px; text-align:center; border-top:1px solid #eee;">
        <p style="color:#999; font-size:13px; margin:0;">FoodKart Restaurant Dashboard | Please prepare this order promptly.</p>
      </div>
    </div>`;

  try {
    const promises = [];

    // Send to customer
    if (userData.email) {
      promises.push(sendEmail({ to: userData.email, subject: `🎉 Order Confirmed! #${orderData.id?.slice(-8).toUpperCase()} - FoodKart`, html: customerHtml }));
    }

    // Send to restaurant owner
    promises.push(sendEmail({ to: process.env.RESTAURANT_EMAIL || 'jjeevan5540@gmail.com', subject: `🍽️ New Order #${orderData.id?.slice(-8).toUpperCase()} from ${userData.name || 'Customer'}`, html: ownerHtml }));

    // WhatsApp to customer (if phone provided)
    if (userData.phone && process.env.CALLMEBOT_API_KEY && process.env.CALLMEBOT_API_KEY !== 'placeholder_key') {
      const customerMsg = `🍔 FoodKart Order Confirmed!\nOrder #${orderData.id?.slice(-8).toUpperCase()}\n${itemsText}\nTotal: ₹${grandTotal}\nDelivery: ${orderData.address}\nETA: 35-45 mins`;
      promises.push(sendWhatsApp(userData.phone, customerMsg).catch(e => console.warn('WhatsApp to customer failed:', e.message)));
    }

    // WhatsApp to restaurant owner
    if (process.env.CALLMEBOT_API_KEY && process.env.CALLMEBOT_API_KEY !== 'placeholder_key') {
      const ownerMsg = `🆕 New Order #${orderData.id?.slice(-8).toUpperCase()}\nRestaurant: ${restaurantName}\nCustomer: ${userData.name || 'N/A'} (${userData.phone || 'N/A'})\n${itemsText}\nTotal: ₹${grandTotal}\nAddress: ${orderData.address}`;
      promises.push(sendWhatsApp(process.env.RESTAURANT_PHONE || '8978925540', ownerMsg).catch(e => console.warn('WhatsApp to owner failed:', e.message)));
    }

    await Promise.all(promises);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Order notification error:', error);
    res.status(500).json({ error: 'Failed to send order notifications', details: error.message });
  }
});

// ─── Route: Payment Confirmation ─────────────────────────────────────────────
app.post('/api/notify-payment', async (req, res) => {
  const { orderData, userData, paymentMethod } = req.body;
  if (!orderData || !userData) return res.status(400).json({ error: 'Missing data' });

  const deliveryFee = 40;
  const platformFee = 20;
  const taxes = Math.round(orderData.total * 0.05);
  const grandTotal = orderData.total + deliveryFee + platformFee + taxes;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
      <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 40px 32px; text-align: center;">
        <div style="font-size: 60px; margin-bottom: 16px;">✅</div>
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 900;">Payment Successful!</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">₹${grandTotal} paid via ${paymentMethod || 'Online Payment'}</p>
      </div>
      <div style="padding: 40px 32px; text-align: center;">
        <h2 style="color: #1a1a1a; margin: 0 0 8px;">Thank you, ${userData.name || userData.email.split('@')[0]}!</h2>
        <p style="color: #555; margin: 0 0 24px;">Your payment of <strong style="color:#10b981;">₹${grandTotal}</strong> has been received successfully.</p>
        <div style="background: #f0fdf4; border-radius: 12px; padding: 20px; margin-bottom: 16px;">
          <p style="margin:0; color:#166534; font-size:14px;">🆔 Order ID: <strong>#${orderData.id?.slice(-8).toUpperCase()}</strong></p>
          <p style="margin:8px 0 0; color:#166534; font-size:14px;">💳 Payment Method: <strong>${paymentMethod || 'Online Payment'}</strong></p>
          <p style="margin:8px 0 0; color:#166534; font-size:14px;">⏱️ Estimated Delivery: <strong>35 - 45 Minutes</strong></p>
        </div>
      </div>
      <div style="background: #f8f8f8; padding: 24px 32px; text-align: center; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 13px; margin: 0;">Need help? 📞 <a href="tel:8978925540" style="color: #e23744;">8978925540</a> | ✉️ <a href="mailto:jjeevan5540@gmail.com" style="color: #e23744;">jjeevan5540@gmail.com</a></p>
      </div>
    </div>`;

  try {
    const promises = [
      sendEmail({ to: userData.email, subject: `✅ Payment Confirmed ₹${grandTotal} - FoodKart Order #${orderData.id?.slice(-8).toUpperCase()}`, html })
    ];

    // WhatsApp payment confirmation
    if (userData.phone && process.env.CALLMEBOT_API_KEY && process.env.CALLMEBOT_API_KEY !== 'placeholder_key') {
      const msg = `✅ FoodKart Payment Confirmed!\nAmount: ₹${grandTotal}\nMethod: ${paymentMethod || 'Online'}\nOrder #${orderData.id?.slice(-8).toUpperCase()}\nYour food is being prepared! 🍳`;
      promises.push(sendWhatsApp(userData.phone, msg).catch(e => console.warn('WhatsApp payment notification failed:', e.message)));
    }

    await Promise.all(promises);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Payment notification error:', error);
    res.status(500).json({ error: 'Failed to send payment notification', details: error.message });
  }
});

// ─── Route: WhatsApp Only ─────────────────────────────────────────────────────
app.post('/api/send-whatsapp', async (req, res) => {
  const { phone, message } = req.body;
  if (!phone || !message) return res.status(400).json({ error: 'Phone and message are required' });

  try {
    await sendWhatsApp(phone, message);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send WhatsApp', details: error.message });
  }
});

// ─── Route: Create Razorpay Order ───────────────────────────────────────────
app.post('/api/create-razorpay-order', async (req, res) => {
  const { amount, currency = 'INR', receipt } = req.body;

  if (!amount) return res.status(400).json({ error: 'Amount is required' });

  try {
    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    res.status(500).json({ error: 'Failed to create payment order', details: error.message });
  }
});

// ─── Route: Report Issue Email ──────────────────────────────────────────────
app.post('/api/report-issue', async (req, res) => {
  const { userData, reportData } = req.body;

  if (!reportData || !reportData.issue) {
    return res.status(400).json({ error: 'Issue details are required' });
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); border: 1px solid #fee2e2;">
      <div style="background: #e23744; padding: 32px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 900;">⚠️ New Issue Reported</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">FoodKart Customer Support</p>
      </div>
      <div style="padding: 32px;">
        <div style="background: #fef2f2; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="margin: 0; color: #991b1b; font-size: 14px;"><strong>Issue Type:</strong> ${reportData.issue}</p>
          <p style="margin: 8px 0 0; color: #991b1b; font-size: 14px;"><strong>Order ID:</strong> ${reportData.orderId || 'Not provided'}</p>
        </div>
        
        <h3 style="color: #1a1a1a; margin: 0 0 12px; font-size: 16px;">Description:</h3>
        <p style="color: #4b5563; font-size: 15px; line-height: 1.6; background: #f9fafb; padding: 16px; border-radius: 8px;">${reportData.description}</p>
        
        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #f3f4f6;">
          <h3 style="color: #1a1a1a; margin: 0 0 12px; font-size: 16px;">Customer Details:</h3>
          <p style="margin: 0; color: #4b5563; font-size: 14px;"><strong>Name:</strong> ${userData?.name || 'Guest'}</p>
          <p style="margin: 6px 0 0; color: #4b5563; font-size: 14px;"><strong>Email:</strong> ${userData?.email || 'N/A'}</p>
          <p style="margin: 6px 0 0; color: #4b5563; font-size: 14px;"><strong>Phone:</strong> ${userData?.phone || 'N/A'}</p>
        </div>
      </div>
      <div style="background: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="color: #64748b; font-size: 12px; margin: 0;">This report was generated from the FoodKart Help Center.</p>
      </div>
    </div>
  `;

  try {
    const adminEmail = process.env.RESTAURANT_EMAIL || 'gowda2003pooja@gmail.com';
    await sendEmail({
      to: adminEmail,
      subject: `⚠️ ISSUE REPORT [${reportData.issue}] - ${userData?.name || 'Customer'}`,
      html
    });
    res.status(200).json({ success: true, message: 'Report sent successfully' });
  } catch (error) {
    console.error('Issue report email error:', error);
    res.status(500).json({ error: 'Failed to send report email', details: error.message });
  }
});

// ─── Route: Test Email Connection ──────────────────────────────────────────
app.get('/api/test-email', async (req, res) => {
  const testEmail = req.query.email || process.env.SMTP_USER;
  try {
    console.log(`🧪 Testing SMTP connection for ${testEmail}...`);
    const info = await sendEmail({
      to: testEmail,
      subject: '🧪 FoodKart: SMTP Test Connection Successful',
      html: `<h1>SMTP is working! ✅</h1><p>If you see this, your Gmail App Password is configured correctly for <strong>FoodKart</strong>.</p>`
    });
    res.status(200).json({ success: true, message: 'Test email sent successfully!', messageId: info.messageId });
  } catch (error) {
    console.error('❌ SMTP Test Failed:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication failed. Please ensure you are using a Gmail App Password, not your regular password.',
      details: error.message
    });
  }
});

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n🚀 FoodKart Notification Server running at http://localhost:${PORT}`);
  console.log(`📧 SMTP: ${process.env.SMTP_USER}`);
  console.log(`🍽️  Restaurant: ${process.env.RESTAURANT_EMAIL} | ${process.env.RESTAURANT_PHONE}`);
  console.log(`📱 WhatsApp: ${process.env.CALLMEBOT_API_KEY !== 'placeholder_key' ? 'Configured ✅' : 'Not configured (add CALLMEBOT_API_KEY to .env)'}\n`);
});
