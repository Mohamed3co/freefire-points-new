import express from "express";
import admin from "firebase-admin";

// إصلاح مشكلة التوقيت
process.env.TZ = 'UTC';

const app = express();
const port = process.env.PORT || 3000;

// 🔥 هنا ضع المفتاح الذي أرسلته لي (بدون تعديل)
const FIREBASE_KEY = `
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCoRS8WGCkdP9S3
34C3IMFl5EmPnMMyY32v/smzEnzkRmMZVAV9FvJ0e20jrs+WMACetQOXniEYDx18
4IY6ZixTcLuRClfA7ri/qrccgXe0SShuq3+swQHFyk/rOHOrXsnQ5ASKF3Q+rXMp
+db2vH0aFuIzkb7DXiIEHRymLdsq70OmneeA2u+QYkiFjc73hezgtbRhHsyZxQbl
xT1fg2xTrQS5jqlb2p+uKCIEYTKOhBmH9nzdKiThIkhkw+bE1bz8dUelCQAKLxze
YZxtoXQP4eDEAtn5VtSnXGZJWkLRD0zr0x8DPv9Vjs1JWSlDia4vGR6+fTRy2sOw
eyAxIeXpAgMBAAECggEAF51P8JiW6oMq+dv8nxaSdZduSGB+V0u1l5WY3k/dpZaI
MUWEmKu3/mdU53FQshnN+HfcR3KaX9s9Lul+hOMSXOpg9EegjZOi60kMtgwoTa2H
plJcklSqyERuZ0sOlpHwnidlyLBmcKZcV1t30rwcjWUBPS36uMW03eFtBBhC3fko
QhYcDqEhpXLx4esLCvuxBaVxW8Yvthk2uCFwM1HC2FcOUkAIDUL8tmlTNh4gG1L4
Fm/34+hmY00ZvZY78Zgkx8sCfqMzTQQinyKi/0dYDbeAM4pqqcQ5587xRw+CIfmb
r1SLi3BO+P6Vb5+LxsqbZvN+p5oAzMlSNVMTUYPMNQKBgQDRpa40pZ6++AL5ub52
L+I+3VrhveTSDeOi1KZKmi01N8qPD0zXlik69N/u35QX6Ps6wu/8KwTNUbDkhcVI
s4wMO+XiwB/MUa8/NsWXdbiuME4ox9XscJdPueBbbsUqGVIf/L4Ai1XgxxLJS5PE
3+BiyiwM6WzHWlLXRU7E3a5aLQKBgQDNeYL+jWelRJE7xm7aWvCCb5cAKyzpLUCj
alUucM4EVg3nlvjSfqbIRPYD6Q1eE64kln+mWjHqOmb1QH4Fii1djpGD9ApcinE4
mmNL0Pdly1NzigJntxTh8T1NHtotGZWI7agTAg6PIaEkRDhvPgaFPU6ARQJ/bj5f
CWPaxS+8LQKBgQCJoUsMJO5iUE8jwlzXGfhdbNQM/q0JeTTH4PKKZ0zmcwn3gQPh
RCMtITUhjIWcbMcBfJgv483zPH30iB1L7RMztN7mTVqSt81kooB1PkNPl0a4XviB
kCjFnjE71Sx6xsSzWykhElf+iLI8k/EefhrAwBjLITLYbOOVj1p2w1GCwQKBgQC7
RkjSYWdaBkioxo86jTAwciyahr+ENy52wu+oSEA9S4GY1s0qbSzt04y2u67nU+Cg
kFr/760W4uv8FC/INMxsPQj7z22yMqxG/tAJxgf2y37gC6VtijyKQimxJLGN8YeN
Ka7KxFEou2n3eAZHvayLu/jUiBFiu8Q1MoXEW3zKcQKBgBb9eCyzUNk05EthOuJT
zcfG7Qfmgy8cBHMC2tTQfxE/CPXWeB+tdcjMAse4OK9pTOwfK/3EtGMpBv5M6Z3n
mJYy20Y1xJob5PcQHilKNeGUAYZliKTWxkG3u8JDlCHYI2gihcoY5eaZKf1P6Syy
VRDDAldV0wO04Rg2ICO1UdLT
-----END PRIVATE KEY-----
`;

// تهيئة Firebase
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "freefirerewardsdz-69572",
    clientEmail: "firebase-adminsdk-fbsvc@freefirerewardsdz-69572.iam.gserviceaccount.com",
    privateKey: FIREBASE_KEY.replace(/\\n/g, '\n')
  }),
  databaseURL: "https://freefirerewardsdz-69572-default-rtdb.firebaseio.com"
});

console.log("✅ تم تهيئة Firebase بنجاح");

// الروت الأساسي
app.get("/postback", async (req, res) => {
  try {
    const { ml_sub1: player_id, payout } = req.query;
    if (!player_id || !payout) throw new Error("مطلوب player_id و payout");
    
    const points = Math.floor(payout * 300);
    await admin.database().ref(`users/${player_id}/points`).transaction(current => (current || 0) + points);
    
    console.log(`تم إضافة ${points} نقطة للاعب ${player_id}`);
    return res.send("تمت العملية بنجاح");
  } catch (error) {
    console.error("حدث خطأ:", error.message);
    return res.status(500).send(error.message);
  }
});

app.listen(port, () => console.log(`🚀 السيرفر يعمل على المنفذ ${port}`));
