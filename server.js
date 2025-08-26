import express from "express";
import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";

// ضبط التوقيت على UTC
process.env.TZ = 'UTC';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Firebase إعداد
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "freefirerewardsdz-69572",
    clientEmail: "firebase-adminsdk-fbsvc@freefirerewardsdz-69572.iam.gserviceaccount.com",
    privateKey: `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCdxbOc5RFjmNN4
IIqTZSnHkW+THjkcfZvMt1Nz2b3O8YTJMQG7xVkRY10TKpvwPy7KFA4/U7QdXJf7
cw11wrBUh8EKtg+vfQaC/lGFVzeNr2wCGB96NIlScF1TmcQWU7YQqGd6u4YirTrH
NOj/aDr57HEH9zCcndBFYpJV5YCGgm1uUeo/ui2OPnSsy6+xcTtY9pC1kj7YcyLh
Mu/j8mGsLgX8oxAFqvijYurgEAXFXEym3sXPx5LwVHvGPUwEDvTSmgj4I1aPKt1k
5TaTlwnV+hbIqovFr0B+vJmTWLv0N44PVqD2JmV1htK/+wgVnSmsbEww3tqo8Y1+
NzmNIuUNAgMBAAECggEAFe8orakWDg3u5m5FvcCseouQYrhqsbiPyrn4/uv4bLcc
ohjvWALTg2yYQcQkelXaZCs+INU6/vMCySlBZ4wJ1jKqZpoRm7Dq0RbY0AwkU80d
27utUqDPr5eiDe+ceIsqTm4PNtuvxg3l1FCZjPqZamoR+8zEpB13mVHfLNRzlh9/
ZrJbzaP4A0JyESTaKHg9VI5R5i0FSkq87VTA1O/rqY3VTB8vvlDKlREGOcPplJ2c
iaK++XOXdSCbDWizXh9PPjb4rV9zzSctif7QLY9QoK02oz4CILqCIdI+FEMQZF3/
gtLBZRxbwIavHkc5HZ7VMYGo6ge00BJzPvHB1agJ0QKBgQDWTqthpFA4YyMcFtXO
06lSQIG9V6ghEFVuSAy/fapURrLa2ysLv06jwoV7PIJhS/MmaxBXtDFwTnCHtTrG
HmDAJsC7PtiQzwf2C0KBlklqylcIzOs+deGKN3qkfAKZSrh2/yFmMsKB8OIguCiY
Z3Agn8Y4ocPrt2YickHofUaGXQKBgQC8d16XRhipToZA4+6puUO4GZGpXmiRhOD5
cPjkVAZ4iA/SDpvr7bovlVuj5DNvFsNqAtFB/yoThiZXhA2w3qTqmXs5MG1j6AVT
eiJRvWrkqdI8JCWX3/dT6kJ5E8rN7hsPic4JZLBPTU7OMvEHrRwTshpS0HoRUc/h
xiwDkMKOcQKBgQCJi/6Fcd+nAUIUkjdyQvmG+C4NJ4iaiBA88vNzqCU9aA79VvPe
20+O3ZesjB6mcgfCna7ki5u7cCyzfUcWx4KTcYv74g8/ihFzArER2TKP3wRTeqp1
8VTr0EXf8lP8rS+N+JwoKuYaXk/Ubj5n6uPVnJat3G2SCaj87NaOcHFmZQKBgAZu
HDAVGCpOn43/ONlZlNHnLW0V54NvgS2BiTxhEYdzPPbxwKggCEYvVl0VIBweLrSj
O/iAeDMKVKyPuNfcAMxwSB//YvwRonzioeEgEVGT6bRbl1zDK3EVgQcYgcbc5Nd2
4Cy53roV7SZj3o1gfqC9ZuCEdGW64NjXJhFJExpBAoGBAME/8X+Mp1rOb427qA8J
qy495+SR7bfTe2mt2zx37lwv+bbVsSoHZof1+2b8nTXG7dq/PuObyQugmrLA0wh0
KSNvZH9FB2K2ozNS+1JGiQX2uuiy4nN4eRqVK9IExJG6IoIqifFAMsUhi9ZIq0kg
pF0ADGtG3O27mMgXOgAMLTKS
-----END PRIVATE KEY-----`,
  }),
  databaseURL: "https://freefirerewardsdz-69572-default-rtdb.firebaseio.com"
});

console.log("✅ Firebase initialized successfully.");

app.use(express.static(__dirname));

// نقطة postback
app.get("/postback", async (req, res) => {
  const { transaction_id, program_name, payout, ml_sub1, player_id, adgem_sub } = req.query;

  console.log("📩 Postback received:", req.query);

  if (!ml_sub1 && !adgem_sub) {
    return res.status(400).send("Missing ml_sub1 or adgem_sub");
  }

  try {
    const db = admin.database();

    if (ml_sub1 && payout) {
      const userRef = db.ref(`users/${ml_sub1}`);
      const snapshot = await userRef.child("points").once("value");
      const pointsToAdd = Math.round(parseFloat(payout) * 300);
      const newPoints = (snapshot.val() || 0) + pointsToAdd;
      await userRef.update({ points: newPoints });
      console.log(`✅ Added ${pointsToAdd} MyLead points to ${ml_sub1} (Total: ${newPoints})`);
    }

    if (adgem_sub && payout) {
      const userRef = db.ref(`users/${adgem_sub}`);
      const snapshot = await userRef.child("adgemPoints").once("value");
      const pointsToAdd = Math.round(parseFloat(payout) * 300);
      const newPoints = (snapshot.val() || 0) + pointsToAdd;
      await userRef.update({ adgemPoints: newPoints });
      console.log(`✅ Added ${pointsToAdd} AdGem points to ${adgem_sub} (Total: ${newPoints})`);
    }

    const txRef = db.ref(`transactions/${transaction_id || "no_id"}`);
    await txRef.set({ transaction_id, program_name, payout, ml_sub1, adgem_sub, player_id, timestamp: Date.now() });

    res.send("Postback OK");
  } catch (error) {
    console.error("❌ Postback Error:", error);
    res.status(500).send("Error processing postback");
  }
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
