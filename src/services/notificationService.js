import { BACKEND_URL } from '../config/notifications';

/**
 * Sends a login notification email to the user.
 */
export const sendLoginNotification = async (user) => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/notify-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, name: user.name }),
        });
        const data = await res.json();
        if (data.success) console.log('✅ Login notification sent');
        else console.warn('⚠️ Login notification failed:', data.error);
        return data;
    } catch (error) {
        console.error('Login notification error:', error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Sends order notifications to customer and restaurant owner.
 */
export const sendOrderNotifications = async (orderData, userData) => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/notify-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderData, userData }),
        });
        const data = await res.json();
        if (data.success) console.log('✅ Order notifications sent (customer + restaurant)');
        else console.warn('⚠️ Order notification failed:', data.error);
        return data;
    } catch (error) {
        console.error('Order notification error:', error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Sends payment confirmation notification.
 */
export const sendPaymentNotification = async (orderData, userData, paymentMethod) => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/notify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderData, userData, paymentMethod }),
        });
        const data = await res.json();
        if (data.success) console.log('✅ Payment notification sent');
        else console.warn('⚠️ Payment notification failed:', data.error);
        return data;
    } catch (error) {
        console.error('Payment notification error:', error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Sends a food issue report email to the restaurant/admin.
 */
export const sendIssueReport = async (reportData, userData) => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/report-issue`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reportData, userData }),
        });

        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await res.text();
            console.error('⚠️ Received non-JSON response from server:', text.slice(0, 200));
            return { success: false, error: 'Server returned an invalid response. Please try again later.' };
        }

        const data = await res.json();
        if (data.success) console.log('✅ Issue report sent');
        else console.warn('⚠️ Issue report failed:', data.error);
        return data;
    } catch (error) {
        console.error('Issue report error:', error.message);
        return { success: false, error: error.message };
    }
};
