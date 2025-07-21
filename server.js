import express from "express";
import dotenv from "dotenv";
import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// إصلاح مشكلة التوقيت (يجب أن يكون في الأعلى)
process.env.TZ = 'UTC';

// تحميل المتغيرات من .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// إنشاء التطبيق
const app = express();
const port = process.env.PORT || 3000;

console.log("🕒 Server boot time (UTC):", new Date().toISOString());

// 🟡 Firebase إعداد (النسخة المعدلة)
try {
  // الطريقة الجديدة بدون استخدام ملف serviceAccountKey.json
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "freefirerewardsdz-69572",
      clientEmail: "firebase-adminsdk-fbsvc@freefirerewardsdz-69572.iam.gserviceaccount.com",
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || 
        "-----BEGIN PRIVATE KEY-----\n" +
        "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCoRS8WGCkdP9S3\n" +
        "34C3IMFl5EmPnMMyY32v/smzEnzkRmMZVAV9FvJ0e20jrs+WMACetQOXniEYDx18\n" +
        "4IY6ZixTcLuRClfA7ri/qrccgXe0SShuq3+swQHFyk/rOHOrXsnQ5ASKF3Q+rXMp\n" +
        "+db2vH0aFuIzkb7DXiIEHRymLdsq70OmneeA2u+QYkiFjc73hezgtbRhHsyZxQbl\n" +
        "xT1fg2xTrQS5jqlb2p+uKCIEYTKOhBmH9nzdKiThIkhkw+bE1bz8dUelCQAKLxze\n" +
        "YZxtoXQP4eDEAtn5VtSnXGZJWkLRD0zr0x8DPv9Vjs1JWSlDia4vGR6+fTRy2sOw\n" +
        "eyAxIeXpAgMBAAECggEAF51P8JiW6oMq+dv8nxaSdZduSGB+V0u1l5WY3k/dpZaI\n" +
        "MUWEmKu3/mdU53FQshnN+HfcR3KaX9s9Lul+hOMSXOpg9EegjZOi60kMtgwoTa2H\n" +
        "plJcklSqyERuZ0sOlpHwnidlyLBmcKZcV1t30rwcjWUBPS36uMW03eFtBBhC3fko\n" +
        "QhYcDqEhpXLx4esLCvuxBaVxW8Yvthk2uCFwM1HC2FcOUkAIDUL8tmlTNh4gG1L4\n" +
        "Fm/34+hmY00ZvZY78Zgkx8sCfqMzTQQinyKi/0dYDbeAM4pqqcQ5587xRw+CIfmb\n" +
        "r1SLi3BO+P6Vb5+LxsqbZvN+p5oAzMlSNVMTUYPMNQKBgQDRpa40pZ6++AL5ub52\n" +
        "L+I+3VrhveTSDeOi1KZKmi01N8qPD0zXlik69N/u35QX6Ps6wu/8KwTNUbDkhcVI\n" +
        "s4wMO+XiwB/MUa8/NsWXdbiuME4ox9XscJdPueBbbsUqGVIf/L4Ai1XgxxLJS5PE\n" +
        "3+BiyiwM6WzHWlLXRU7E3a5aLQKBgQDNeYL+jWelRJE7xm7aWvCCb5cAKyzpLUCj\n" +
        "alUucM4EVg3nlvjSfqbIRPYD6Q1eE64kln+mWjHqOmb1QH4Fii1djpGD9ApcinE4\n" +
        "mmNL0Pdly1NzigJntxTh8T1NHtotGZWI7agTAg6PIaEkRDhvPgaFPU6ARQJ/bj5f\n" +
        "CWPaxS+8LQKBgQCJoUsMJO5iUE8jwlzXGfhdbNQM/q0JeTTH4PKKZ0zmcwn3gQPh\n" +
        "RCMtITUhjIWcbMcBfJgv483zPH30iB1L7RMztN7mTVqSt81kooB1PkNPl0a4XviB\n" +
        "kCjFnjE71Sx6xsSzWykhElf+iLI8k/EefhrAwBjLITLYbOOVj1p2w1GCwQKBgQC7\n" +
        "RkjSYWdaBkioxo86jTAwciyahr+ENy52wu+oSEA9S4GY1s0qbSzt04y2u67nU+Cg\n" +
        "kFr/760W4uv8FC/INMxsPQj7z22yMqxG/tAJxgf2y37gC6VtijyKQimxJLGN8YeN\n" +
        "Ka7KxFEou2n3eAZHvayLu/jUiBFiu8Q1MoXEW3zKcQKBgBb9eCyzUNk05EthOuJT\n" +
        "zcfG7Qfmgy8cBHMC2tTQfxE/CPXWeB+tdcjMAse4OK9pTOwfK/3EtGMpBv5M6Z3n\n" +
        "mJYy20Y1xJob5PcQHilKNeGUAYZliKTWxkG3u8JDlCHYI2gihcoY5eaZKf1P6Syy\n" +
        "VRDDAldV0wO04Rg2ICO1UdLT\n" +
        "-----END PRIVATE KEY-----"
    }),
    databaseURL: "https://freefirerewardsdz-69572-default-rtdb.firebaseio.com"
  });
  console.log("✅ Firebase initialized successfully.");
} catch (err) {
  console.error("❌ Firebase initialization error:", err);
  process.exit(1); // إيقاف السيرفر إذا فشلت التهيئة
}

// 📂 تقديم الملفات الساكنة
app.use(express.static(__dirname));

// ✅ Postback endpoint
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

// ... (بقية الكود كما هو)

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
