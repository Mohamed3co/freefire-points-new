import express from "express";
import fetch from "node-fetch";
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

// Firebase
const serviceAccount = JSON.parse(
  fs.readFileSync(path.join(__dirname, "serviceAccountKey.json"))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://freefirerewardsdz-69572-default-rtdb.firebaseio.com"
});

// Serve static HTML
app.use(express.static(__dirname));

// ✅ عروض CPA - فلترة هولندا فقط + ترتيب الحقول
app.get("/api/offers", async (req, res) => {
  try {
    const response = await fetch("https://www.cpagrip.com/common/offer_feed_csv.php?user_id=2407883&key=3f2682325b819c43e34f23f6d074a4c8");
    const csv = await response.text();
    const lines = csv.split("\n").slice(1);
    const offers = lines
      .filter(line => line.trim() !== "")
      .map(line => {
        const parts = line.split(",");
        return {
          id: parts[0],
          title: parts[1],
          description: parts[2],
          offer_url: parts[3],
          image: parts[4],
          country: parts[6],
          payout: parseFloat(parts[8])
        };
      })
      .filter(offer => offer.country === "NL"); // ✅ هولندا فقط

    res.json(offers);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error fetching offers");
  }
});

// ✅ Telegram Notification
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
    res.status(500).send("Error sending");
  }
});

app.listen(port, () => console.log(`✅ Server running on port ${port}`));
