import crypto from 'crypto';
import axios from 'axios';

// PhonePe API Configuration
const PHONEPE_MERCHANT_ID = process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ID;
const PHONEPE_SALT_KEY = process.env.PHONEPE_SALT_KEY;
const PHONEPE_SALT_INDEX = process.env.PHONEPE_SALT_INDEX || '1';
const PHONEPE_API_URL = 'https://api.phonepe.com/apis/hermes'; // Production
// const PHONEPE_API_URL = 'https://api-preprod.phonepe.com/apis/pg-sandbox'; // Sandbox for testing

export const initiatePhonePePayment = async (orderDetails) => {
  try {
    const { orderId, amount, userName, userPhone, userEmail } = orderDetails;

    // Prepare payload
    const payload = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId: `TXN_${orderId}_${Date.now()}`,
      merchantUserId: userEmail.replace('@', '_'),
      amount: Math.round(amount * 100), // Amount in paise
      redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-callback`,
      redirectMode: 'POST',
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment-callback`,
      mobileNumber: userPhone.replace('+91', ''),
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    // Encode payload to Base64
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');

    // Generate X-VERIFY header
    const checksumString = base64Payload + '/pg/v1/pay' + PHONEPE_SALT_KEY;
    const checksum = crypto.createHash('sha256').update(checksumString).digest('hex');
    const xVerify = `${checksum}###${PHONEPE_SALT_INDEX}`;

    // Make API request
    const response = await axios.post(
      `${PHONEPE_API_URL}/pg/v1/pay`,
      {
        request: base64Payload
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': xVerify
        }
      }
    );

    if (response.data.success) {
      return {
        success: true,
        paymentUrl: response.data.data.instrumentResponse.redirectInfo.url,
        transactionId: payload.merchantTransactionId
      };
    } else {
      throw new Error('Payment initiation failed');
    }
  } catch (error) {
    console.error('PhonePe payment error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const verifyPhonePePayment = async (transactionId) => {
  try {
    const checksumString = `/pg/v1/status/${PHONEPE_MERCHANT_ID}/${transactionId}` + PHONEPE_SALT_KEY;
    const checksum = crypto.createHash('sha256').update(checksumString).digest('hex');
    const xVerify = `${checksum}###${PHONEPE_SALT_INDEX}`;

    const response = await axios.get(
      `${PHONEPE_API_URL}/pg/v1/status/${PHONEPE_MERCHANT_ID}/${transactionId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': xVerify
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Payment verification error:', error);
    return null;
  }
};
