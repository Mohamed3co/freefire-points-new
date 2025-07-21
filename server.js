import express from "express";
import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";

// لضبط التوقيت على UTC
process.env.TZ = 'UTC';

// مسارات الملفات
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// بدء التطبيق
const app = express();
const port = process.env.PORT || 3000;

// ✅ Firebase إعداد
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "freefirerewardsdz-69572",
    clientEmail: "firebase-adminsdk-fbsvc@freefirerewardsdz-69572.iam.gserviceaccount.com",
    privateKey: `-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCdxbOc5RFjmNN4\nIIqTZSnHkW+THjkcfZvMt1Nz2b3O8YTJMQG7xVkRY10TKpvwPy7KFA4/U7QdXJf7\ncw11wrBUh8EKtg+vfQaC/lGFVzeNr2wCGB96NIlScF1TmcQWU7YQqGd6u4YirTrH\nNOj/aDr57HEH9zCcndBFYpJV5YCGgm1uUeo/ui2OPnSsy6+xcTtY9pC1kj7YcyLh\nMu/j8mGsLgX8oxAFqvijYurgEAXFXEym3sXPx5LwVHvGPUwEDvTSmgj4I1aPKt1k\n5TaTlwnV+hbIqovFr0B+vJmTWLv0N44PVqD2JmV1htK/+wgVnSmsbEww3tqo8Y1+\nNzmNIuUNAgMBAAECggEAFe8orakWDg3u5m5FvcCseouQYrhqsbiPyrn4/uv4bLcc\nohjvWALTg2yYQcQkelXaZCs+INU6/vMCySlBZ4wJ1jKqZpoRm7Dq0RbY0AwkU80d\n27utUqDPr5eiDe+ceIsqTm4PNtuvxg3l1FCZjPqZamoR+8zEpB13mVHfLNRzlh9/\nZrJbzaP4A0JyESTaKHg9VI5R5i0FSkq87VTA1O/rqY3VTB8vvlDKlREGOcPplJ2c\niaK++XOXdSCbDWizXh9PPjb4rV9zzSctif7QLY9QoK02oz4CILqCIdI+FEMQZF3/\ngtLBZRxbwIavHkc5HZ7VMYGo6ge00BJzPvHB1agJ0QKBgQDWTqthpFA4YyMcFtXO\n06lSQIG9V6ghEFVuSAy/fapURrLa2ysLv06jwoV7PIJhS/MmaxBXtDFwTnCHtTrG\nHmDAJsC7PtiQzwf2C0KBlklqylcIzOs+deGKN3qkfAKZSrh2/yFmMsKB8OIguCiY\nZ3Agn8Y4ocPrt2YickHofUaGXQKBgQC8d16XRhipToZA4+6puUO4GZGpXmiRhOD5\ncPjkVAZ4iA/SDpvr7bovlVuj5DNvFsNqAtFB/yoThiZXhA2w3qTqmXs5MG1j6AVT\neiJRvWrkqdI8JCWX3/dT6kJ5E8rN7hsPic4JZLBPTU7OMvEHrRwTshpS0HoRUc/h\nxiwDkMKOcQKBgQCJi/6Fcd+nAUIUkjdyQvmG+C4NJ4iaiBA88vNzqCU9aA79VvPe\n20+O3ZesjB6mcgfCna7ki5u7mCyzfUcWx4KTcYv74g8/ihFzArER2TKP3wRTeqp1\n8VTr0EXf8lP8rS+N+JwoKuYaXk/Ubj5n6uPVnJat3G2SCaj87NaOcHFmZQKBgAZu\nHDAVGCpOn43/ONlZlNHnLW0V54NvgS2BiTxhEYdzPPbxwKggCEYvVl0VIBweLrSj\nO/iAeDMKVKyPuNfcAMxwSB//YvwRonzioeEgEVGT6bRbl1zDK3EVgQcYgcbc5Nd2\n4Cy53roV7SZj3o1gfqC9ZuCEdGW64NjXJhFJExpBAoGBAME/8X+Mp1rOb427qA8J\nqy495+SR7bfTe2mt2zx37lwv+bbVsSoHZof1+2b8nTXG7dq/PuObyQugmrLA0wh0\nKSNvZH9FB2K2ozNS+1JGiQX2uuiy4nN4eRqVK9IExJG6IoIqifFAMsUhi9ZIq0kg\npF0ADGtG3O27mMgXOgAMLTKS\n-----END PRIVATE KEY-----\n`
  }),
  databaseURL: "https://freefirerewardsdz-69572-default-rtdb.firebaseio.com"
});

console.log("✅ Firebase initialized successfully.");

// ملفات HTML أو أي ملفات ثابتة
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

// تشغيل السيرفر
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
