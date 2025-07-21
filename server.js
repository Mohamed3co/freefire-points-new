// server.js

import express from "express";
import dotenv from "dotenv";
import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

// تحميل متغيرات البيئة من .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// إعداد Firebase Admin SDK
const serviceAccount = {
  "type": "service_account",
  "project_id": process.env.FB_PROJECT_ID,
  "private_key_id": process.env.FB_PRIVATE_KEY_ID,
  "private_key": process.env.FB_PRIVATE_KEY.replace(/\\n/g, '\n'),
  "client_email": process.env.FB_CLIENT_EMAIL,
  "client_id": process.env.FB_CLIENT_ID,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": process.env.FB_CLIENT_CERT_URL
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FB_DB_URL
});

const db = admin.firestore();

// 📌 رابط الـ POSTBACK الذي تستدعيه شركة الإعلانات
app.get("/postback", async (req, res) => {
  const { transaction_id, program_name, payout, ml_sub1 } = req.query;

  if (!transaction_id || !program_name || !payout || !ml_sub1) {
    return res.status(400).send("❌ بيانات ناقصة في الرابط.");
  }

  try {
    const userRef = db.collection("users").doc(ml_sub1);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).send("❌ المستخدم غير موجود.");
    }

    const currentPoints = userDoc.data().points || 0;
    const addedPoints = parseInt(payout);

    await userRef.update({
      points: currentPoints + addedPoints,
      last_offer: program_name,
      last_transaction_id: transaction_id,
      last_update: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.status(200).send("✅ تم إضافة النقاط بنجاح.");
  } catch (error) {
    console.error("🔥 خطأ في postback:", error);
    return res.status(500).send("❌ خطأ في معالجة الاسترجاع.");
  }
});

// استماع للسيرفر
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
