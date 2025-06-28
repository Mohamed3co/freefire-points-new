const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // هذه لعرض index.html تلقائيًا

// Endpoint: Check server
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Endpoint: Get Offers
app.get('/offers', async (req, res) => {
  try {
    const response = await axios.get('https://www.cpagrip.com/common/load_content_json.php?user_id=2407883');
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ عند جلب العروض' });
  }
});

// Endpoint: Send Telegram notification
app.post('/withdraw', async (req, res) => {
  const { userId, points, gameId } = req.body;

  const message = `🚀 طلب شحن جديد\n- المعرف: ${userId}\n- النقاط: ${points}\n- ID اللعبة: ${gameId}`;

  try {
    await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
      chat_id: process.env.CHAT_ID,
      text: message
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'فشل إرسال الإشعار' });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
