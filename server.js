import express from "express";
import dotenv from "dotenv";
import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Firebase config
const serviceAccount = JSON.parse(
  fs.readFileSync(path.join(__dirname, "serviceAccountKey.json"))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://freefirerewardsdz-69572-default-rtdb.firebaseio.com"
});

// Middleware لتحليل query parameters
app.use(express.urlencoded({ extended: true }));

// ✅ Endpoint: Postback (مُحسّن)
app.get("/postback", async (req, res) => {
  try {
    const { ml_sub1: rawPlayerId, payout, transaction_id } = req.query;

    // 1. التحقق من وجود البيانات الأساسية
    if (!rawPlayerId || !payout || !transaction_id) {
      return res.status(400).send("Missing required parameters");
    }

    // 2. تنظيف player_id من الأحرف غير المسموحة
    const player_id = rawPlayerId.replace(/[\[\]\.#$]/g, "");
    if (!player_id) {
      return res.status(400).send("Invalid player ID");
    }

    // 3. التحقق من أن payout رقم صحيح
    const pointsToAdd = Math.round(parseFloat(payout) * 300);
    if (isNaN(pointsToAdd) {
      return res.status(400).send("Invalid payout value");
    }

    // 4. تحديث البيانات في Firebase
    const userRef = admin.database().ref(`users/${player_id}`);
    await userRef.update({
      points: admin.database.ServerValue.increment(pointsToAdd),
      last_transaction: transaction_id,
      last_updated: new Date().toISOString()
    });

    console.log(`✅ تم إضافة ${pointsToAdd} نقطة للاعب ${player_id}`);
    res.status(200).send("Postback processed successfully");
    
  } catch (error) {
    console.error("🔥 خطأ في معالجة الطلب:", error);
    res.status(500).send("Internal server error");
  }
});

// ... (بقية الكود كما هو)
