// server.js

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

// Serve static files (frontend)
app.use(express.static(__dirname));

// ✅ Endpoint: Postback
app.get("/postback", async (req, res) => {
  const { ml_sub1: player_id, payout } = req.query;

  if (!player_id || !payout) {
    return res.status(400).send("Missing player_id or payout");
  }

  try {
    const userRef = admin.database().ref(`users/${player_id}`);

    // جلب النقاط الحالية
    const snapshot = await userRef.child("points").once("value");
    const currentPoints = snapshot.val() || 0;

    // حساب النقاط
    const pointsToAdd = Math.round(parseFloat(payout) * 300); // 1$ = 300 نقطة

    // تحديث النقاط
    await userRef.update({
      points: currentPoints + pointsToAdd
    });

    console.log(`✅ Added ${pointsToAdd} points to user ${player_id}`);
    res.send("Postback OK");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing postback");
  }
});

// ✅ Telegram Notification (إذا أردت)
app.get("/api/notify", async (req, res) => {
  const { message } = req.query;
  if (!message) return res.status(400).send("Missing message");
  try {
    await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: process.env.CHAT_ID,
        text: message
      })
    });
    res.send("Sent");
  } catch (e) {
    console.error(e);
    res.status(500).send("Error sending notification");
  }
});

// ✅ Start server
app.listen(port, () => console.log(`✅ Server running on port ${port}`));
