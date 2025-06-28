const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Endpoint لجلب العروض
app.get('/offers', (req, res) => {
  res.json({
    offers: [
      {
        offer_id: "67722",
        title: "You can get a $750 Temu Gift Card Now!",
        description: "Enter your information now for a chance to win.",
        payout: "2.70",
        offerlink: "https://www.cpagrip.com/show.php?l=0&u=2407883&id=67722",
        offerphoto: "https://www.cpagrip.com/admin/media/offers/b067cce5fecf969deec80d4e1869e91a.png"
      },
      {
        offer_id: "68777",
        title: "See the Samples you can Get!",
        description: "Enter your information now to get started.",
        payout: "2.73",
        offerlink: "https://www.cpagrip.com/show.php?l=0&u=2407883&id=68777",
        offerphoto: "https://www.cpagrip.com/admin/media/offers/00137b631e6b0f9885eda10093db1579.png"
      },
      {
        offer_id: "68776",
        title: "See the Samples you can Get!",
        description: "Enter your information now to get started.",
        payout: "2.73",
        offerlink: "https://www.cpagrip.com/show.php?l=0&u=2407883&id=68776",
        offerphoto: "https://www.cpagrip.com/admin/media/offers/e4bb763b31bf9130be1960378458c297.png"
      }
    ]
  });
});

// Endpoint لاستقبال طلب الشحن وإرسال رسالة تليغرام
app.post('/request-redeem', async (req, res) => {
  const { userId, points } = req.body;

  if (!userId || !points) {
    return res.status(400).json({ success: false, message: 'بيانات ناقصة' });
  }

  const message = `✅ طلب شحن جديد\nID اللاعب: ${userId}\nالنقاط: ${points}`;
  const telegramUrl = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`;

  try {
    await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.CHAT_ID,
        text: message
      })
    });

    res.json({ success: true, message: 'تم إرسال الطلب' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'حدث خطأ' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
