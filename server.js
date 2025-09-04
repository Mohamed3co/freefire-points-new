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

// ✅ إضافة middleware لتحليل JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Firebase إعداد
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "freefirerewardsdz-69572",
    clientEmail: "firebase-adminsdk-fbsvc@freefirerewardsdz-69572.iam.gserviceaccount.com",
    privateKey: `-----BEGIN PRIVATE KEY-----
MIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQCUrZELe0SbjOux
e0AVmkTlluI8ye7/0ff6pENKMFHhqfIlDS0MAcwPHdY9pCGSD1gM43kkJToE63k6
UpuQUXOrWQRcRB7E4rXrQfkmG68nbaM6WGJY+PCCBqxF654ygx/Qk74QfNv2lkWi
PBIsoX0cLdRpzrxYbpHsy5G5qC/bIUSbcFwfL5o9klK1fnc24Bssx2nPckINv5Yq
+5tCl6de1SBQnteWwM4gR7cje6w0q5kKT0Zs03fSa6acCMjOYzjliQrA69//b7Z3
Ybd+kLlCrkZgoDtf+0b32hJnb1U8J14P2cVkK49/UynoIdXKbe0005CF8RFikpnP
eG9bH4QHAgMBAAECgf87UL9Z921nsoy7/cVPHU349WyAKWVSiFAiWWZc/5S8UO6w
hCrJ9NyFb6YrnBxzOjRvNC9CgKilCZDtb38HJbwRBqXHw0NyOBGPH22cTwjFOrQo
ktYhMXQXwTxxDyj8/f3VfRvwZvD0PJkk7Ti5Yl6prCea26yM8KEC6LzUQ97T0U2z
RPkdZXUNE2wxs4DnOe1bd8ud//wFd3Mu152BrALjNWPctwoifqr6SHBcIrjdvOAN
dw3S45gtAwTe/H1XKIMjTl4E3sH+KXel9H28VKWkzkRj9zJ6rvQWUBy2mA8Jh07E
RXwVQs5DqiCBUXdm4so3uHpVszXQh7RAn4WIyeECgYEAyC9yxZyXUQ4mI8HJrRLT
RvQLxka1nOqLma7+rgqsr01rBN/k8KLVacb0p42mjvGy2zWUbAMzDn8EG+rifKaM
2kKokwyHd1WVbSNMwmTaqMtUCxbLTe4fszkHQSrhW91haDc/AEgrpLbZPhD2qKVT
PtQWvUfksoKJG8q65NzDtt0CgYEAviGytaFrEkHN65n/EnwfIkyhWvcz8587U8Ea
rNhzh7XK/7D2zm5nCm8A+OtJC2CQyLd4Px6S1JwUAPWl5RH+glJ0bFy8sl1aowlU
xmszxKqFO6HP8gLeAG9zZ2U6fk4YUAJusYFmS44mDtc48zGW27yzZSaK1mZelXTh
iG2KDjMCgYBh996aWTUwhNUjgK47VlAxlDPC+E3fGmXxc1PORwkVzbSHMS9wmLAK
0URgT5FouV6HqyQU7EfrWzvekcf/qt6Z3i9zr5kITMkRHUpuhD8Chmd9+czLObMn
2cv0F5EsjR4ji434jFlXheixWEnuZOJliBQM1AdXWUzSXhey81uQvQKBgG1373Hd
50zSsGHW/2JALpjL8Bb0v2ekJT9ariYYVaQsSh2fYOqH7DG4qaGnrh2r0pCN+eC1
lKpu1qGazZIvIw8btEZzun0jfLzj8XhwXpT77MvhpV1cwz8S7Cn6wYvZIOxoCh2P
ODuGM2lWB0cWJRqM8ejqIQPCWvDII9Yt40+7AoGBAImOAncrWagvrSKLaXDSzDyV
zUmgIyg9oTzADl3a0uQfpXv1V9ggyJEFTccmZ03ln+2Db//WX8dOb6R29a4FLHJV
Zi5OImTLeOSDnrYS76CyT4BNKincJnByDoJIBpUH5zMI+8G9C82CPr5oHfjJ/SWt
Y7HSlngWesUHhECM4Q8p
-----END PRIVATE KEY-----`,
  }),
  databaseURL: "https://freefirerewardsdz-69572-default-rtdb.firebaseio.com"
});

console.log("✅ Firebase initialized successfully.");

// ملفات HTML أو أي ملفات ثابتة
app.use(express.static(__dirname));

// قائمة IPs مسموحة للمنصات الإعلانية
const ALLOWED_IPS = {
  MYLEAD: [
    '52.31.137.75', '52.49.173.169', '52.214.14.220', // MyLead IPs
  ],
  ADGEM: [
    '35.185.125.13', '35.185.126.53', // AdGem IPs
  ],
  LOCAL: [
    '127.0.0.1', '::1', '::ffff:127.0.0.1', // للاختبار المحلي
    '0.0.0.0' // للاختبار على Render
  ]
};

// ✅ دالة لاستخراج وتنظيف الـ IP
function getCleanIp(req) {
  let ip = req.ip || req.connection.remoteAddress;
  
  // تنظيف الـ IP من البادئات
  if (ip.startsWith('::ffff:')) {
    ip = ip.substring(7);
  }
  
  // إزالة المنفذ إذا كان موجوداً
  if (ip.includes(':')) {
    ip = ip.split(':')[0];
  }
  
  return ip;
}

// ✅ دالة للتحقق من IP المصدر
function checkAllowedIP(clientIP, platform) {
  const allowedIPs = [...ALLOWED_IPS[platform], ...ALLOWED_IPS.LOCAL];
  return allowedIPs.includes(clientIP);
}

// ✅ نقطة postback لدعم MyLead (بدون أي تغيير)
app.get("/postback", async (req, res) => {
  const { transaction_id, program_name, payout, ml_sub1, player_id, status } = req.query;

  console.log("📩 Postback received from MyLead:", req.query);

  // التحقق من IP المصدر
  const clientIP = getCleanIp(req);
  if (!checkAllowedIP(clientIP, 'MYLEAD')) {
    console.warn(`❌ IP غير مسموح لـ MyLead: ${clientIP}`);
    return res.status(403).send("غير مصرح");
  }

  console.log(`✅ IP مسموح لـ MyLead: ${clientIP}`);

  // نحدد معرف المستخدم سواء جاي من MyLead أو AdGem
  const autoUserId = ml_sub1 || player_id;

  if (!autoUserId || !payout) {
    console.warn("❌ Missing userId or payout");
    return res.status(400).send("Missing userId or payout");
  }

  // التحقق من حالة التحويل (إذا كانت موجودة)
  if (status && status !== "approved") {
    console.warn(`❌ حالة غير معتمدة: ${status}`);
    return res.status(400).send("حالة التحويل غير معتمدة");
  }

  try {
    const db = admin.database();
    
    // التحقق من عدم تكرار المعاملة
    if (transaction_id) {
      const existingTxRef = db.ref(`transactions/${transaction_id}`);
      const existingTx = await existingTxRef.once('value');
      
      if (existingTx.exists()) {
        console.log(`⚠️ معاملة مكررة: ${transaction_id}`);
        return res.status(200).send("معاملة مكررة - تم تجاهلها");
      }
    }
    
    // البحث عن معرف جوجل المرتبط بالمعرف التلقائي
    const userMappingsRef = db.ref('userMappings');
    const snapshot = await userMappingsRef.orderByChild('autoGeneratedId').equalTo(autoUserId).once('value');
    
    if (!snapshot.exists()) {
      console.warn(`❌ لا يوجد مستخدم مرتبط بالمعرف: ${autoUserId}`);
      
      // تخزين المعاملة pending حتى يتم ربط الحساب
      if (transaction_id) {
        const pendingTxRef = db.ref(`pendingTransactions/${transaction_id}`);
        await pendingTxRef.set({
          transaction_id,
          program_name,
          payout,
          autoUserId,
          timestamp: Date.now(),
          status: "pending_user_linking",
          source: "mylead"
        });
        console.log(`✅ تم حفظ المعاملة pending: ${transaction_id}`);
      }
      
      return res.status(404).send("User mapping not found");
    }
    
    // الحصول على معرف جوجل الفعلي
    let googleUserId = null;
    snapshot.forEach((childSnapshot) => {
      googleUserId = childSnapshot.key;
    });
    
    if (!googleUserId) {
      return res.status(404).send("Google user ID not found");
    }

    // تحديث نقاط المستخدم باستخدام معرف جوجل
    const userRef = db.ref(`users/${googleUserId}`);
    const pointsSnapshot = await userRef.child("points").once("value");
    const pointsToAdd = Math.round(parseFloat(payout) * 300);
    const newPoints = (pointsSnapshot.val() || 0) + pointsToAdd;

    await userRef.update({ points: newPoints });

    console.log(`✅ Added ${pointsToAdd} points to ${googleUserId} (Total: ${newPoints})`);

    // تخزين بيانات البوستباك في transactions
    const txId = transaction_id || "mylead_no_id_" + Date.now();
    const txRef = db.ref(`transactions/${txId}`);
    await txRef.set({
      transaction_id,
      program_name,
      payout,
      autoUserId,
      googleUserId,
      points: pointsToAdd,
      timestamp: Date.now(),
      status: "completed",
      ip: clientIP,
      source: "mylead"
    });

    console.log(`✅ تم تخزين معاملة MyLead: ${txId}`);
    
    // إرسال رد ناجح إلى MyLead
    res.status(200).send("OK");

  } catch (error) {
    console.error("❌ MyLead Postback Error:", error);
    res.status(500).send("Error processing postback");
  }
});

// ✅ نقطة postback جديدة لدعم AdGem
app.get("/postback-adgem", async (req, res) => {
  const { playerid, amount, transaction_id } = req.query;

  console.log("📩 Postback received from AdGem:", req.query);

  // التحقق من IP المصدر
  const clientIP = getCleanIp(req);
  if (!checkAllowedIP(clientIP, 'ADGEM')) {
    console.warn(`❌ IP غير مسموح لـ AdGem: ${clientIP}`);
    return res.status(403).send("غير مصرح");
  }

  console.log(`✅ IP مسموح لـ AdGem: ${clientIP}`);

  if (!playerid || !amount) {
    console.warn("❌ Missing playerid or amount");
    return res.status(400).send("Missing playerid or amount");
  }

  try {
    const db = admin.database();
    
    // التحقق من عدم تكرار المعاملة
    if (transaction_id) {
      const existingTxRef = db.ref(`transactions/${transaction_id}`);
      const existingTx = await existingTxRef.once('value');
      
      if (existingTx.exists()) {
        console.log(`⚠️ معاملة مكررة: ${transaction_id}`);
        return res.status(200).send("معاملة مكررة - تم تجاهلها");
      }
    }
    
    // البحث عن معرف جوجل المرتبط بالمعرف التلقائي
    const userMappingsRef = db.ref('userMappings');
    const snapshot = await userMappingsRef.orderByChild('autoGeneratedId').equalTo(playerid).once('value');
    
    if (!snapshot.exists()) {
      console.warn(`❌ لا يوجد مستخدم مرتبط بالمعرف: ${playerid}`);
      
      // تخزين المعاملة pending حتى يتم ربط الحساب
      if (transaction_id) {
        const pendingTxRef = db.ref(`pendingTransactions/${transaction_id}`);
        await pendingTxRef.set({
          transaction_id,
          playerid,
          amount,
          timestamp: Date.now(),
          status: "pending_user_linking",
          source: "adgem"
        });
        console.log(`✅ تم حفظ معاملة AdGem pending: ${transaction_id}`);
      }
      
      return res.status(404).send("User mapping not found");
    }
    
    // الحصول على معرف جوجل الفعلي
    let googleUserId = null;
    snapshot.forEach((childSnapshot) => {
      googleUserId = childSnapshot.key;
    });
    
    if (!googleUserId) {
      return res.status(404).send("Google user ID not found");
    }

    // تحديث نقاط المستخدم باستخدام معرف جوجل
    const userRef = db.ref(`users/${googleUserId}`);
    const pointsSnapshot = await userRef.child("points").once("value");
    const pointsToAdd = Math.round(parseFloat(amount) * 300); // نفس المضاعف المستخدم في MyLead
    const newPoints = (pointsSnapshot.val() || 0) + pointsToAdd;

    await userRef.update({ points: newPoints });

    console.log(`✅ Added ${pointsToAdd} points to ${googleUserId} (Total: ${newPoints})`);

    // تخزين بيانات البوستباك في transactions
    const txId = transaction_id || "adgem_no_id_" + Date.now();
    const txRef = db.ref(`transactions/${txId}`);
    await txRef.set({
      transaction_id,
      playerid,
      amount,
      googleUserId,
      points: pointsToAdd,
      timestamp: Date.now(),
      status: "completed",
      ip: clientIP,
      source: "adgem"
    });

    console.log(`✅ تم تخزين معاملة AdGem: ${txId}`);
    
    // إرسال رد ناجح إلى AdGem
    res.status(200).send("OK");

  } catch (error) {
    console.error("❌ AdGem Postback Error:", error);
    res.status(500).send("Error processing postback");
  }
});

// ✅ نقطة جديدة لربط المعرف التلقائي بمعرف جوجل
app.post("/link-account", async (req, res) => {
  try {
    const { autoGeneratedId, googleUserId } = req.body;
    
    if (!autoGeneratedId || !googleUserId) {
      return res.status(400).json({ error: "يجب تقديم معرفين صالحين" });
    }
    
    const db = admin.database();
    const userMappingsRef = db.ref('userMappings');
    
    // ربط المعرف التلقائي بمعرف جوجل
    await userMappingsRef.child(googleUserId).set({
      autoGeneratedId: autoGeneratedId,
      linkedAt: new Date().toISOString()
    });
    
    console.log(`✅ تم ربط المعرف التلقائي ${autoGeneratedId} بمعرف جوجل ${googleUserId}`);
    
    // التحقق من وجود معاملات pending لهذا المستخدم (من AdGem وMyLead)
    const pendingTxRef = db.ref('pendingTransactions');
    const pendingSnapshot = await pendingTxRef.orderByChild('autoUserId').equalTo(autoGeneratedId).once('value');
    
    let processedCount = 0;
    if (pendingSnapshot.exists()) {
      console.log(`📋 يوجد معاملات pending للمستخدم: ${autoGeneratedId}`);
      
      const userRef = db.ref(`users/${googleUserId}`);
      const pointsSnapshot = await userRef.child("points").once("value");
      let currentPoints = pointsSnapshot.val() || 0;
      
      // معالجة جميع المعاملات pending
      const updates = {};
      pendingSnapshot.forEach((childSnapshot) => {
        const pendingTx = childSnapshot.val();
        const pointsToAdd = Math.round(parseFloat(pendingTx.payout || pendingTx.amount) * 300);
        currentPoints += pointsToAdd;
        
        // نقل المعاملة إلى transactions
        updates[`transactions/${pendingTx.transaction_id}`] = {
          ...pendingTx,
          googleUserId,
          points: pointsToAdd,
          processedAt: Date.now(),
          status: "completed_later"
        };
        
        // حذف المعاملة من pending
        updates[`pendingTransactions/${pendingTx.transaction_id}`] = null;
        
        console.log(`✅ تمت معالجة المعاملة pending: ${pendingTx.transaction_id}`);
        processedCount++;
      });
      
      // تحديث نقاط المستخدم
      updates[`users/${googleUserId}/points`] = currentPoints;
      
      // تنفيذ جميع التحديثات مرة واحدة
      await db.ref().update(updates);
      
      console.log(`✅ تمت إضافة ${currentPoints - (pointsSnapshot.val() || 0)} نقطة من المعاملات pending`);
    }
    
    res.status(200).json({ 
      success: true, 
      message: "تم ربط الحساب بنجاح",
      pendingProcessed: processedCount
    });
  } catch (error) {
    console.error("❌ Error linking account:", error);
    res.status(500).json({ 
      success: false, 
      message: "خطأ في ربط الحساب" 
    });
  }
});

// ✅ نقطة للحصول على معلومات المستخدم
app.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const db = admin.database();
    
    const userRef = db.ref(`users/${userId}`);
    const userData = await userRef.once('value');
    
    if (!userData.exists()) {
      return res.status(404).json({ error: "المستخدم غير موجود" });
    }
    
    res.json(userData.val());
  } catch (error) {
    console.error("❌ Error fetching user data:", error);
    res.status(500).json({ error: "خطأ في جلب بيانات المستخدم" });
  }
});

// ✅ نقطة للحصول على جميع المعاملات
app.get("/transactions", async (req, res) => {
  try {
    const db = admin.database();
    const transactionsRef = db.ref('transactions');
    const transactions = await transactionsRef.once('value');
    
    res.json(transactions.val() || {});
  } catch (error) {
    console.error("❌ Error fetching transactions:", error);
    res.status(500).json({ error: "خطأ في جلب المعاملات" });
  }
});

// ✅ نقطة للحصول على المعاملات pending
app.get("/pending-transactions", async (req, res) => {
  try {
    const db = admin.database();
    const pendingRef = db.ref('pendingTransactions');
    const pending = await pendingRef.once('value');
    
    res.json(pending.val() || {});
  } catch (error) {
    console.error("❌ Error fetching pending transactions:", error);
    res.status(500).json({ error: "خطأ في جلب المعاملات pending" });
  }
});

// ✅ نقطة للتحقق من صحة السيرفر
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    message: "السيرفر يعمل بشكل صحيح",
    timestamp: new Date().toISOString()
  });
});

// ✅ نقطة لعرض معلومات حول الإعدادات
app.get("/info", (req, res) => {
  res.json({
    myleadPostbackUrl: "https://freefire-points-new.onrender.com/postback?transaction_id=[transaction_id]&program_name=[program_name]&payout=[payout]&ml_sub1=[ml_sub1]",
    adgemPostbackUrl: "https://freefire-points-new.onrender.com/postback-adgem?playerid={player_id}&amount={amount}&transaction_id={transaction_id}",
    allowedIPs: ALLOWED_IPS,
    version: "1.1.0"
  });
});

// تشغيل السيرفر
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`📊 Endpoints:`);
  console.log(`   - GET  /postback (MyLead Postback)`);
  console.log(`   - GET  /postback-adgem (AdGem Postback)`);
  console.log(`   - POST /link-account`);
  console.log(`   - GET  /user/:userId`);
  console.log(`   - GET  /transactions`);
  console.log(`   - GET  /pending-transactions`);
  console.log(`   - GET  /health`);
  console.log(`   - GET  /info`);
  console.log(`\n🔗 MyLead Postback URL:`);
  console.log(`   https://freefire-points-new.onrender.com/postback?transaction_id=[transaction_id]&program_name=[program_name]&payout=[payout]&ml_sub1=[ml_sub1]`);
  console.log(`\n🔗 AdGem Postback URL:`);
  console.log(`   https://freefire-points-new.onrender.com/postback-adgem?playerid={player_id}&amount={amount}&transaction_id={transaction_id}`);
});
