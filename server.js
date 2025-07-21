import express from 'express';
import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Firebase Admin Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccount = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'serviceAccountKey.json'))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

// Express App
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * MyLead Postback Handler
 * Endpoint: /postback
 * Expected Params:
 * - ml_sub1: User ID
 * - payout: Payout amount
 * - transaction_id: Unique transaction ID
 */
app.get('/postback', async (req, res) => {
  try {
    // 1. Validate Input
    const { ml_sub1: rawUserId, payout, transaction_id } = req.query;

    if (!rawUserId || !payout || !transaction_id) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required parameters'
      });
    }

    // 2. Sanitize User ID
    const userId = rawUserId.replace(/[^a-zA-Z0-9_-]/g, '');

    // 3. Validate Payout
    const payoutValue = parseFloat(payout);
    if (isNaN(payoutValue) || payoutValue <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payout value'
      });
    }

    // 4. Calculate Points (1$ = 300 points)
    const pointsToAdd = Math.round(payoutValue * 300);

    // 5. Update Firebase
    const userRef = admin.database().ref(`users/${userId}`);
    const updates = {
      points: admin.database.ServerValue.increment(pointsToAdd),
      last_transaction: transaction_id,
      last_updated: new Date().toISOString()
    };

    await userRef.update(updates);

    // 6. Log Success
    console.log(`💰 Points added | User: ${userId} | Points: ${pointsToAdd} | TX: ${transaction_id}`);

    // 7. Send Response
    res.json({
      success: true,
      message: 'Points credited successfully',
      data: {
        userId,
        pointsAdded: pointsToAdd,
        transactionId: transaction_id
      }
    });

  } catch (error) {
    console.error('🔥 Postback Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Postback URL: http://yourdomain.com/postback?ml_sub1=USER_ID&payout=AMOUNT&transaction_id=TX_ID`);
});
