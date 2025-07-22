import express from "express";
import admin from "firebase-admin";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// إعداد Firebase Admin
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL,
});

const db = admin.firestore();

app.use(express.static("public"));
app.use(express.json());

// Endpoint جلب العروض من Firebase
app.get("/offers", async (req, res) => {
  try {
    const snapshot = await db.collection("offers").get();
    const offers = snapshot.docs.map(doc => doc.data());
    res.json(offers);
  } catch (error) {
    console.error("خطأ أثناء جلب العروض:", error);
    res.status(500).send("حدث خطأ أثناء جلب العروض.");
  }
});

// تتبع النقرة
app.post("/track-click", async (req, res) => {
  const { userId, offerTitle } = req.body;
  if (!userId || !offerTitle) return res.status(400).send("بيانات غير كافية.");

  try {
    const ref = db.collection("clicks").doc();
    await ref.set({
      userId,
      offerTitle,
      timestamp: Date.now(),
    });
    res.send("تم التتبع.");
  } catch (err) {
    res.status(500).send("خطأ أثناء التتبع.");
  }
});

app.listen(PORT, () => {
  console.log(`السيرفر شغال على http://localhost:${PORT}`);
});
