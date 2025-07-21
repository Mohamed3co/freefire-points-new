import express from "express";
import admin from "firebase-admin";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// تحميل متغيرات البيئة
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// إعداد Firebase Admin
const serviceAccount = JSON.parse(
  fs.readFileSync(path.join(__dirname, "serviceAccountKey.json"), "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL, // ضع هذا في ملف .env
});

const db = admin.database();
const app = express();
const port = process.env.PORT || 3000;

// السماح باستخدام ملفات استاتيكية (اختياري إن لم تكن تستخدم CSS/JS خارجي)
app.use(express.static("public"));

// تقديم صفحة HTML
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ar">
    <head>
      <meta charset="UTF-8" />
      <title>Firebase Check</title>
    </head>
    <body>
      <h2>تحقق من نقاط المستخدم</h2>
      <form id="form">
        <input type="text" id="uid" placeholder="أدخل UID" />
        <button type="submit">تحقق</button>
      </form>
      <p id="result"></p>
      <script>
        const form = document.getElementById("form");
        const result = document.getElementById("result");
        form.addEventListener("submit", async (e) => {
          e.preventDefault();
          const uid = document.getElementById("uid").value.trim();
          const res = await fetch("/check/" + uid);
          const data = await res.json();
          result.innerText = data.error ? data.error : "النقاط: " + data.points;
        });
      </script>
    </body>
    </html>
  `);
});

// Endpoint للتحقق من النقاط
app.get("/check/:uid", async (req, res) => {
  const uid = req.params.uid;
  try {
    const snapshot = await db.ref("users/" + uid + "/points").once("value");
    const points = snapshot.val();
    if (points === null) {
      res.json({ error: "المستخدم غير موجود أو لا يملك نقاط" });
    } else {
      res.json({ points });
    }
  } catch (error) {
    res.status(500).json({ error: "حدث خطأ في الاتصال بقاعدة البيانات" });
  }
});

app.listen(port, () => {
  console.log(`الخادم يعمل على http://localhost:${port}`);
});
