import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase-admin-init';
import twilio from 'twilio';

// This endpoint is called by PhonePe after payment completion
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { transactionId, code, merchantId } = req.body || {};

    // Payment status from PhonePe
    const paymentSuccess = code === 'PAYMENT_SUCCESS';

    if (!transactionId) {
      return res.status(400).json({ message: 'Transaction ID required' });
    }

    // Find the order with this transactionId in Firestore
    // We need to search for it - for now redirect handling happens client-side
    // The client-side payment-callback page will handle the SMS sending

    return res.status(200).json({ 
      success: true, 
      paymentSuccess,
      transactionId 
    });
  } catch (error) {
    console.error('Payment callback error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
