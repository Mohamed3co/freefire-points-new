const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const admin = require('firebase-admin');
const TelegramBot = require('node-telegram-bot-api');
const csv = require('csv-parser');
const { Readable } = require('stream');

const app = express();
const PORT = process.env.PORT || 3000;

// تفعيل CORS
app.use(cors());
app.use(bodyParser.json());

// --- تهيئة Firebase Admin ---
admin.initializeApp({
  credential: admin.credential.cert({
    "type": "service_account",
    "project_id": "freefirerewardsdz-69572",
    "private_key_id": "49423d482c0699e90d773ddd98a289d99ac531ff",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDaMRr0Ao2Eh0Iz\nSquNkZHfHx+uLA6aiGd/MqhbZ85PYMmmGSNyBdks1ArZqg3hj7PgZ2zmKpalYVMD\nGH8Qv3V2H9xQsnfhWipbYCiFtQTH6tjw4vwaA9UfzmNQyKSNBapORp79niujw4mR\nCnIBcsYp1vJ81uoifZpZFBA8oOHtItVroFsszReJveFfv6nrKYtDleBGOR/7qbNp\nvD4TfQm8KtsK2NNg9NaNlZmJHOZ25q980peRS9jUbmJHI7mhrXJNUN1aSsWRtc9d\nWQ3INgVsb3HzcAEIa6K+guOH39oO6y/z/tKYtneXNnHjZLHFzl6wiQBSYWg+LPKH\nCr67SbgPAgMBAAECggEADN9pyiyeYcvDFZiZr3P/qazB5zo1MFvM013PPflNXDSH\nIRQJmdALhJAMBdR5Fi4uvBYOADRSB/bKeXvH/1p0WSA/FMm6teJmblapfV31JsBN\nxUR3ACfquoIoLNtxjdpgNlcHSUo8I+DE7Hgzyq8VTuGeE8xwKtHDOe8rmBAb1Cwm\njQ8UYZB070dOBXaTbI2c6/H1IOwt8E1Y3bbpLfI+yHoup+QZNkHsNZfb9OFPWgk4\npqep4LYS+monZJDXbDVPKPLbpeiQmQ1yPCjEgUDkQVzMVxG1MZCgb5Mj0WJgwqw4\nijfzu01Zcv5ZxrNirUmgVPYw6/hK0HHgumzoCeg3ZQKBgQDs/SszFfUVnhF6cypG\nHvGEB5o3yC8Y+MttnhMCAIq2Z5+teQdtBPVZIP65KmJN/lvk/nU3VvOxYvgK3Zb3\n5Zm4armWFY/0R/NlbzRP1jt/g7D/LfSHWj2DBuPPmoI/8u0MylfqLACfXic7pzzf\n9l3efEqKXIkkG18e41K+AjQk9QKBgQDrsequ0QlM/KPwwU8dm1qGc9bGQvWtVNEm\n55VQAzoMcB9QQjeN/tT8R/AOxGjPqrlsYng4xnKGr8o98KsdXZ0NyfWv5TVFpNxy\nwyPe0SU6UFvQw9LrxlvO/obrG3e+yUPPHQogY16QQ2bBot6IkiRq+mAJbpBo5ld/\nmWoLEGXmcwKBgEcu4BvvG3eLzAowr2DyiG607eCVc3gXutrJIUJ3sTKKu46ajN11\nINDNtVUe4vo0TZvhxomBx57fcEurNV5ui5a2D9qBzYR9XCF6nobgfWyWvMJZJlrF\ngzZpCmJgMYFN0WAHIxMGdoVn/XbQi9tln9plEOqwUs0Sn6aid0b1WH5FAoGAVjOG\n8pLvROHtj6MTrW9hJ2V8epyIv/ESYZk3ScE0XNIxEah2Kw+1k+M3kB8Tekglctd8\nwr8JqernG8pGuwG+7AkeO0uoNSV7ntlx6A8z/2Tef7bvEF5Gu6jpbVlpbTStATXM\nu1W8gySzk0RfATH58cpKj4iJdmQwQjG4z/0aV7MCgYEAk4TloKTWlQpeGT7LOiab\nFxcPlcwCYnmd1OUj4EWhwcRQ0SJ0Wd9+mz2/ZUAh9mX3My2qtaxLI15/OfBgqxi2\nG8/2mwHHadIMYRk9YuncVy50t9GHYuMjUtrda6dwhRSPRD6wdf5EcXzvpAtvlEy9\ne8/kb2OGKsx2MjZJ7xauug0=",
    "client_email": "firebase-adminsdk-fbsvc@freefirerewardsdz-69572.iam.gserviceaccount.com",
    "client_id": "103224328110678020788",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40freefirerewardsdz-69572.iam.gserviceaccount.com"
  }),
  databaseURL: "https://freefirerewardsdz-69572-default-rtdb.firebaseio.com"
});

// --- تيليجرام Bot ---
const telegramBot = new TelegramBot("8096326997:AAE_UuRKi3gnCdOfXKu76X4D4cPUuXSpPbo");

app.get('/', (req, res) => {
  res.send('✅ السيرفر يعمل بنجاح');
});

// Endpoint: جلب العروض
app.get('/offers', async (req, res) => {
  try {
    const response = await axios.get("https://www.cpagrip.com/common/offer_feed_csv.php?user_id=2407883&key=3f2682325b819c43e34f23f6d074a4c8");
    const csvData = [];
    const stream = Readable.from(response.data);
    stream
      .pipe(csv())
      .on('data', (data) => csvData.push(data))
      .on('end', () => res.json(csvData));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "فشل جلب العروض" });
  }
});

// Endpoint: طلب شحن
app.post('/withdraw', async (req, res) => {
  const { userId, amount, gameId } = req.body;
  if (!userId || !amount || !gameId) {
    return res.status(400).json({ error: "بيانات ناقصة" });
  }

  try {
    // تحديث النقاط
    await admin.database().ref(`users/${userId}/withdraws`).push({
      amount,
      gameId,
      date: new Date().toISOString()
    });

    // ارسال رسالة تيليجرام
    await telegramBot.sendMessage("6285856969", `🚀 طلب شحن جديد\nID: ${userId}\nGame ID: ${gameId}\nAmount: ${amount}`);

    res.json({ success: true, message: "تم إرسال طلب الشحن" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "حدث خطأ أثناء المعالجة" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
