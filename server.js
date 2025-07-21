import express from "express";
import admin from "firebase-admin";

// إصلاح التوقيت (مهم جداً)
process.env.TZ = 'Asia/Riyadh';

const app = express();
const port = process.env.PORT || 3000;

// 🔥 المعلومات الحقيقية الكاملة (يجب حمايتها):
const firebaseConfig = {
  credential: admin.credential.cert({
    projectId: "freefirerewardsdz-69572",
    clientEmail: "firebase-adminsdk-fbsvc@freefirerewardsdz-69572.iam.gserviceaccount.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCoRS8WGCkdP9S3\n34C3IMFl5EmPnMMyY32v/smzEnzkRmMZVAV9FvJ0e20jrs+WMACetQOXniEYDx18\n4IY6ZixTcLuRClfA7ri/qrccgXe0SShuq3+swQHFyk/rOHOrXsnQ5ASKF3Q+rXMp\n+db2vH0aFuIzkb7DXiIEHRymLdsq70OmneeA2u+QYkiFjc73hezgtbRhHsyZxQbl\nxT1fg2xTrQS5jqlb2p+uKCIEYTKOhBmH9nzdKiThIkhkw+bE1bz8dUelCQAKLxze\nYZxtoXQP4eDEAtn5VtSnXGZJWkLRD0zr0x8DPv9Vjs1JWSlDia4vGR6+fTRy2sOw\neyAxIeXpAgMBAAECggEAF51P8JiW6oMq+dv8nxaSdZduSGB+V0u1l5WY3k/dpZaI\nMUWEmKu3/mdU53FQshnN+HfcR3KaX9s9Lul+hOMSXOpg9EegjZOi60kMtgwoTa2H\nplJcklSqyERuZ0sOlpHwnidlyLBmcKZcV1t30rwcjWUBPS36uMW03eFtBBhC3fko\nQhYcDqEhpXLx4esLCvuxBaVxW8Yvthk2uCFwM1HC2FcOUkAIDUL8tmlTNh4gG1L4\nFm/34+hmY00ZvZY78Zgkx8sCfqMzTQQinyKi/0dYDbeAM4pqqcQ5587xRw+CIfmb\nr1SLi3BO+P6Vb5+LxsqbZvN+p5oAzMlSNVMTUYPMNQKBgQDRpa40pZ6++AL5ub52\nL+I+3VrhveTSDeOi1KZKmi01N8qPD0zXlik69N/u35QX6Ps6wu/8KwTNUbDkhcVI\ns4wMO+XiwB/MUa8/NsWXdbiuME4ox9XscJdPueBbbsUqGVIf/L4Ai1XgxxLJS5PE\n3+BiyiwM6WzHWlLXRU7E3a5aLQKBgQDNeYL+jWelRJE7xm7aWvCCb5cAKyzpLUCj\nalUucM4EVg3nlvjSfqbIRPYD6Q1eE64kln+mWjHqOmb1QH4Fii1djpGD9ApcinE4\nmmNL0Pdly1NzigJntxTh8T1NHtotGZWI7agTAg6PIaEkRDhvPgaFPU6ARQJ/bj5f\nCWPaxS+8LQKBgQCJoUsMJO5iUE8jwlzXGfhdbNQM/q0JeTTH4PKKZ0zmcwn3gQPh\nRCMtITUhjIWcbMcBfJgv483zPH30iB1L7RMztN7mTVqSt81kooB1PkNPl0a4XviB\nkCjFnjE71Sx6xsSzWykhElf+iLI8k/EefhrAwBjLITLYbOOVj1p2w1GCwQKBgQC7\nRkjSYWdaBkioxo86jTAwciyahr+ENy52wu+oSEA9S4GY1s0qbSzt04y2u67nU+Cg\nkFr/760W4uv8FC/INMxsPQj7z22yMqxG/tAJxgf2y37gC6VtijyKQimxJLGN8YeN\nKa7KxFEou2n3eAZHvayLu/jUiBFiu8Q1MoXEW3zKcQKBgBb9eCyzUNk05EthOuJT\nzcfG7Qfmgy8cBHMC2tTQfxE/CPXWeB+tdcjMAse4OK9pTOwfK/3EtGMpBv5M6Z3n\nmJYy20Y1xJob5PcQHilKNeGUAYZliKTWxkG3u8JDlCHYI2gihcoY5eaZKf1P6Syy\nVRDDAldV0wO04Rg2ICO1UdLT\n-----END PRIVATE KEY-----"
  }),
  databaseURL: "https://freefirerewardsdz-69572-default-rtdb.firebaseio.com"
};

// تهيئة Firebase
admin.initializeApp(firebaseConfig);

// الملفات الساكنة
app.use(express.static("public"));

// نظام النقاط
app.get("/postback", async (req, res) => {
  try {
    const { ml_sub1: player_id, payout } = req.query;
    
    if (!player_id || !payout) {
      throw new Error("يجب إدخال player_id و payout");
    }

    const points = Math.floor(parseFloat(payout) * 300);
    const userRef = admin.database().ref(`users/${player_id}`);
    
    await userRef.transaction(data => {
      const currentPoints = data?.points || 0;
      return { ...data, points: currentPoints + points };
    });

    console.log(`✅ تم إضافة ${points} نقطة للاعب ${player_id}`);
    res.json({ success: true, pointsAdded: points });
    
  } catch (error) {
    console.error("❌ خطأ:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// الصفحة الرئيسية
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// تشغيل السيرفر
app.listen(port, () => {
  console.log(`🚀 السيرفر يعمل على http://localhost:${port}`);
});
