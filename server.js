import express from "express";
import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";

process.env.TZ = 'UTC';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// إعداد Firebase
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "freefirerewardsdz-69572",
    clientEmail: "firebase-adminsdk-fbsvc@freefirerewardsdz-69572.iam.gserviceaccount.com",
    privateKey: `-----BEGIN PRIVATE KEY-----\n...مفتاحك...\n-----END PRIVATE KEY-----\n`
  }),
  databaseURL: "https://freefirerewardsdz-69572-default-rtdb.firebaseio.com"
});

console.log("✅ Firebase initialized successfully.");

// تقديم ملفات HTML
app.use(express.static(__dirname));

// ✅ نقطة postback
app.get("/postback", async (req, res) => {
  const { ml_sub1: player_id, payout } = req.query;

  if (!player_id || !payout) {
    return res.status(400).send("Missing player_id or payout");
  }

  try {
    const db = admin.database();
    const userRef = db.ref(`users/${player_id}`);
    const snapshot = await userRef.child("points").once("value");
    const pointsToAdd = Math.round(parseFloat(payout) * 300);
    const newPoints = (snapshot.val() || 0) + pointsToAdd;

    await userRef.update({ points: newPoints });
    console.log(`✅ Added ${pointsToAdd} points to ${player_id} (Total: ${newPoints})`);
    res.send("Postback OK");
  } catch (error) {
    console.error("❌ Postback Error:", error);
    res.status(500).send("Error processing postback");
  }
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
