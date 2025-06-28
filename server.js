// استدعاء الحزم
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const admin = require('firebase-admin');

// تهيئة التطبيق
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// تهيئة Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://freefirerewardsdz-69572-default-rtdb.firebaseio.com"
});

const db = admin.database();

// رابط عروض CPA
const offersURL = "https://www.cpagrip.com/common/offer_feed_csv.php?user_id=2407883&key=3f2682325b819c43e34f23f6d074a4c8";

// بيانات Telegram (ضع هنا توكن البوت وChat ID)
const telegramBotToken = "8096326997:AAE_UuRKi3gnCdOfXKu76X4D4cPUuXSpPbo";
const telegramChatId = "6285856969";

// المسار الرئيسي
app.get('/', (req, res) => {
  res.send('✅ السيرفر يعمل بنجاح');
});

// جلب العروض
app.get('/offers', async (req, res) => {
  try {
    const response = await axios.get(offersURL);
    res.send(response.data);
  } catch (error) {
    console.error('خطأ في جلب العروض:', error);
    res.status(500).send('حدث خطأ أثناء جلب العروض');
  }
});

// إضافة نقاط المستخدم
app.post('/addPoints', async (req, res) => {
  const { userId, points } = req.body;
  if (!userId || !points) {
    return res.status(400).send('الرجاء إرسال userId و points');
  }

  try {
    const userRef = db.ref(`users/${userId}`);
    const snapshot = await userRef.once('value');
    let currentPoints = snapshot.val() ? snapshot.val().points : 0;
    await userRef.set({ points: currentPoints + points });

    res.send('✅ تم إضافة النقاط بنجاح');
  } catch (error) {
    console.error('خطأ أثناء إضافة النقاط:', error);
    res.status(500).send('حدث خطأ أثناء إضافة النقاط');
  }
});

// طلب شحن
app.post('/withdraw', async (req, res) => {
  const { userId, gameId } = req.body;
  if (!userId || !gameId) {
    return res.status(400).send('الرجاء إرسال userId و gameId');
  }

  try {
    const message = `🚀 طلب شحن جديد:\n\n👤 UserID: ${userId}\n🎮 GameID: ${gameId}`;
    await axios.post(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
      chat_id: telegramChatId,
      text: message,
    });

    res.send('✅ تم إرسال طلب الشحن بنجاح');
  } catch (error) {
    console.error('خطأ أثناء إرسال رسالة التلغرام:', error);
    res.status(500).send('حدث خطأ أثناء إرسال الطلب');
  }
});

// تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
