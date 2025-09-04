import express from "express";
import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

// لضبط التوقيت على UTC
process.env.TZ = 'UTC';

// مسارات الملفات
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// بدء التطبيق
const app = express();
const port = process.env.PORT || 3000;

// ✅ إضافة middleware لتحليل JSON والكوكيز
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Firebase إعداد - باستخدام المفتاح الصحيح
const serviceAccount = {
  type: "service_account",
  project_id: "freefirerewardsdz-69572",
  private_key_id: "bdd2a923e0fc55a883a2c11428cab094519e1a5a",
  private_key: process.env.FIREBASE_PRIVATE_KEY || "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCzVV76R610zn6Y\nCMp7WQlKz8Wq9q84A0YzYNgkOTRZMWqyTqx1sHbS8iLoLX6dYMir3tJ6/oPXu1ep\nOYiJ5jVZ4RBZo30rZPHO5jFWrsMAI58PpqmSWpO4HOuJmEiQDzmXLisFml4KehQS\nx1pdV1m7yT2/NDDEIgwzUs+oKX2a4OSbSNRxi4MvemrQriA9rGvHYZm9sWf2kYGq\nHiFeTAtKHQe+wPcUxULaN1AoQAXVcTj3cr0+WHzs/+HJiA15Cxi1O43i9zFXz5Ce\nXqgt7Fhh72CEc5QHMLu0ZQFLeIt9Rr82YUS6oAmsRslDasFjiIE8X27wzsyQ46aa\nas8xkD7ZAgMBAAECggEAEb1pNtLuWraumTWNaiRFogvpnt7mOGFCiYST/QlXn1cf\nGeJkdwPszTM8tsEBXGodj7rsEVSqECYtJsVVN2b5chmsd2GP2UIUFYZ57Pw+t/3O\nF0tCTQL+x+C8gBD7ZJzM8qKTiOtbUCgBYlYsHz2r18Kxg/+Sr2Q61rzjY9wu26on\nKp9nWA6TQ3XAcXJ7+J7Ter2Yr7dSei7jaZ0H4eVmyROWI62NQEImn2zeYX68mEU6\nJZ4RLtcAPvXEl4M/RUPwblWmjPSNf5wJabQlqgd7+zGW0r8BURTS9PcvKn3Cklmc\ncK5TlWDJT/jdMaFDNf4qVXNl6wMcQ/Afml5IH7reLQKBgQDcaAt5tvB75l1ylHNC\naWasZpFE2T6MBOzzLITkhs+3foi1e14vY13fWcRWYdJ5jEfYNNi8bZVo54YjV/MA\nmCQZECqnycqqAktTU+1eQt/6YbAOTQUV3dGLUlQc1k/m/vA0L7lDbDDLn2d8wfkA\ngTxnfa3G3iBI/Ry7JcsWEBRNKwKBgQDQS04FBaLBZAD6AR6ToJc/I3xxRZaqwvQk\nAu6DDdlpsS/Q7hCRrljw2Hza9c8KQHs4SozIWfmlp35r0u0d6sQacj3rZ8AyCKbo\nrbFnDaJDR8bh5lSL+pzT/V3FKBTRMIANmdY8J66sErWh8BxjDPgEmDQwXnU0wexL\nHYSnjufKCwKBgCHoF6vXytMks0eHMtwKnvLyrHJtAURFFbarKJ6HZrkRzDIvEmQz\n4yMTCjNHxTtRq1PFfXovWYbT5zzUsNtsjFEWvZkmX/kbdT8ScDfKDe7UzGLG0nt0\nrmHCfpIZHh2pJobAuL14jWEl2qPEq2u6dfJt0SgAz/KqjZr0y3NPcfAVAoGAO4T5\nM1gr7MUNvmKpgRfHgEQ8oAV5iywQJWYtD4fak2gNOM9+LpK6WYATFWJeGhjY3Pn4\nhpunSZ2180ufdAgMp13zsZvBAMsWHrDbW446yqzs+MofaKxhOfZRYDAW2rvYK4rE\n/AV+1S63diGtiuQ+ztlLOHMVXND5G3HA4TxloYcCgYEAoOaSJg8IVh+Id2x1vy9t\necUjnvda92GhbwlWvUzvZRMUBdid91o0BzXdY8lEhdhv1xkdM6bayJHaKPmxZeCj\ni3BXMwrbBNBq97c3FL2ijglXCx27wdP1b0u86qpjmZO+4V1zAQ1YDgiqs+XHvO+y\nrP2I53MJrNEIPJ1eGPEVOcY=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@freefirerewardsdz-69572.iam.gserviceaccount.com",
  client_id: "103224328110678020788",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40freefirerewardsdz-69572.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

// استبدال \\n بـ \n إذا كان المفتاح من متغير البيئة
if (serviceAccount.private_key.includes('\\n')) {
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
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

// ✅ دالة للحصول على IP العميل
function getClientIP(req) {
  return req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 
         (req.connection.socket ? req.connection.socket.remoteAddress : null);
}

// ✅ معالجة روابط الإحالة
app.get("/r/:referralId", async (req, res) => {
  try {
    const { referralId } = req.params;
    const clientIP = getClientIP(req);
    
    console.log(`📩 زيارة رابط إحالة: ${referralId} من IP: ${clientIP}`);
    
    // التحقق إذا كان IP قد زار من قبل
    const ipRef = admin.database().ref(`referralIPs/${clientIP}`);
    const ipSnapshot = await ipRef.once('value');
    
    if (ipSnapshot.exists()) {
      console.log(`⚠️ IP مكرر: ${clientIP}`);
      return res.redirect('/');
    }
    
    // حفظ IP لمنع重复使用
    await ipRef.set({
      referralId,
      timestamp: Date.now(),
      userAgent: req.get('User-Agent')
    });
    
    // حفظ في الكوكيز لمدة 30 يوم
    res.cookie('referralId', referralId, { 
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true
    });
    
    res.redirect('/');
  } catch (error) {
    console.error("❌ Error processing referral link:", error);
    res.redirect('/');
  }
});

// ✅ تطبيق مكافأة الإحالة عند تسجيل مستخدم جديد
app.post("/apply-referral", async (req, res) => {
  try {
    const { userId } = req.body;
    const referralId = req.cookies.referralId;
    
    if (!referralId || !userId) {
      return res.status(400).json({ error: "بيانات ناقصة" });
    }
    
    // منع المستخدم من استخدام رابط الإحالة الخاص به
    if (referralId === userId) {
      return res.status(400).json({ error: "لا يمكن استخدام رابط الإحالة الخاص بك" });
    }
    
    // التحقق إذا كان المستخدم قد استخدم إحالة من قبل
    const userRef = admin.database().ref(`users/${userId}`);
    const userSnapshot = await userRef.once('value');
    
    if (userSnapshot.exists() && userSnapshot.val().referredBy) {
      return res.status(400).json({ error: "لقد استخدمت رابط إحالة من قبل" });
    }
    
    // منح المكافآت
    await rewardReferral(referralId, userId);
    
    // مسح كوكيز الإحالة
    res.clearCookie('referralId');
    
    res.json({ success: true, message: "تم تطبيق رابط الإحالة بنجاح" });
  } catch (error) {
    console.error("❌ Error applying referral:", error);
    res.status(500).json({ error: "فشل في تطبيق رابط الإحالة" });
  }
});

// ✅ دالة منح مكافآت الإحالة
async function rewardReferral(referrerId, referredUserId) {
  const db = admin.database();
  
  // منح 200 نقطة للمُحيل
  const referrerRef = db.ref(`users/${referrerId}`);
  await referrerRef.transaction(user => {
    if (user) {
      user.points = (user.points || 0) + 200;
      user.referralCount = (user.referralCount || 0) + 1;
      user.totalEarned = (user.totalEarned || 0) + 200;
      user.referrals = user.referrals || [];
      user.referrals.push({
        userId: referredUserId,
        date: new Date().toISOString(),
        points: 200
      });
    }
    return user;
  });
  
  // منح 100 نقطة للمُحال
  const referredUserRef = db.ref(`users/${referredUserId}`);
  await referredUserRef.transaction(user => {
    if (user) {
      user.points = (user.points || 0) + 100;
      user.referredBy = referrerId;
      user.signupBonus = 100;
    }
    return user;
  });
  
  console.log(`✅ تم منح مكافآت الإحالة: ${referrerId} -> ${referredUserId}`);
}

// ✅ نقطة postback لدعم MyLead
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
    referralUrl: "https://freefire-points-new.onrender.com/r/:userId",
    allowedIPs: ALLOWED_IPS,
    version: "2.0.0"
  });
});

// تشغيل السيرفر
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`📊 Endpoints:`);
  console.log(`   - GET  /postback (MyLead Postback)`);
  console.log(`   - GET  /postback-adgem (AdGem Postback)`);
  console.log(`   - GET  /r/:userId (رابط الإحالة)`);
  console.log(`   - POST /apply-referral (تطبيق الإحالة)`);
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
  console.log(`\n🔗 Referral URL:`);
  console.log(`   https://freefire-points-new.onrender.com/r/:userId`);
});
