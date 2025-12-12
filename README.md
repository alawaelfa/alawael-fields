# 🏟️ نظام إدارة ملاعب الأوائل

نظام ويب كامل لإدارة حجوزات الملاعب مع قاعدة بيانات ونظام تسجيل دخول.

## 📋 المحتويات

```
alawael-fields/
├── server.js              # السيرفر الرئيسي
├── package.json           # المكتبات المطلوبة
├── .env                   # إعدادات البيئة
├── models/                # نماذج قاعدة البيانات
│   ├── User.js           # نموذج المستخدم
│   ├── Booking.js        # نموذج الحجز
│   └── ArchivedSlot.js   # الفترات المغلقة
├── routes/                # مسارات API
│   ├── auth.js           # تسجيل الدخول والتسجيل
│   └── bookings.js       # إدارة الحجوزات
├── middleware/            # Middleware
│   └── auth.js           # المصادقة
└── public/                # الواجهة الأمامية
    ├── login.html        # صفحة تسجيل الدخول
    └── index.html        # التطبيق الرئيسي
```

## 🚀 التثبيت والتشغيل المحلي

### 1. تثبيت Node.js
قم بتحميل وتثبيت Node.js من: https://nodejs.org/

### 2. تثبيت MongoDB
**الخيار الأول: MongoDB Atlas (سحابي مجاني)**
1. سجل في: https://www.mongodb.com/cloud/atlas/register
2. أنشئ Cluster مجاني
3. احصل على Connection String
4. ضعه في ملف `.env`

**الخيار الثاني: MongoDB محلي**
1. حمل من: https://www.mongodb.com/try/download/community
2. ثبته واتركه يعمل

### 3. تثبيت المكتبات

```bash
npm install
```

### 4. إعداد ملف .env

قم بتعديل ملف `.env`:

```env
# استخدم MongoDB Atlas أو المحلي
MONGODB_URI=mongodb://localhost:27017/alawael-fields
# أو
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/alawael-fields

PORT=3000
JWT_SECRET=غير-هذا-إلى-نص-عشوائي-قوي-جداً
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 5. تشغيل السيرفر

```bash
npm start
```

أو للتطوير (إعادة تشغيل تلقائية):
```bash
npm run dev
```

### 6. الوصول للنظام

افتح المتصفح على: `http://localhost:3000`

**الحساب التجريبي:**
- اسم المستخدم: `admin`
- كلمة المرور: `admin123`

## 🌐 النشر على الإنترنت

### الخيار 1: Render (مجاني)

1. **إنشاء حساب**
   - اذهب إلى: https://render.com
   - سجل حساب جديد

2. **رفع الكود إلى GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/username/alawael-fields.git
   git push -u origin main
   ```

3. **إنشاء Web Service**
   - اضغط "New +" → "Web Service"
   - اختر المستودع من GitHub
   - اسم: alawael-fields
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **إضافة Environment Variables**
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-secret-key
   NODE_ENV=production
   ```

5. **Deploy**
   - اضغط "Create Web Service"
   - انتظر حتى ينتهي النشر

الرابط: `https://alawael-fields.onrender.com`

### الخيار 2: Railway (مجاني)

1. اذهب إلى: https://railway.app
2. سجل حساب
3. "New Project" → "Deploy from GitHub repo"
4. اختر المستودع
5. أضف Environment Variables
6. Deploy تلقائياً!

### الخيار 3: Vercel (مجاني)

1. اذهب إلى: https://vercel.com
2. "Import Project" من GitHub
3. أضف Environment Variables
4. Deploy

### الخيار 4: Heroku (مدفوع/مجاني محدود)

```bash
# تثبيت Heroku CLI
npm install -g heroku

# تسجيل الدخول
heroku login

# إنشاء التطبيق
heroku create alawael-fields

# إضافة MongoDB
heroku addons:create mongolab:sandbox

# رفع الكود
git push heroku main

# فتح التطبيق
heroku open
```

## 🔐 إعداد MongoDB Atlas (موصى به)

1. **إنشاء Cluster**
   - اذهب إلى: https://www.mongodb.com/cloud/atlas
   - اضغط "Build a Database" → "Free Shared"
   - اختر المنطقة الأقرب
   - اسم Cluster: alawael-cluster

2. **إعداد الوصول**
   - Database Access → Add New Database User
   - اسم المستخدم وكلمة المرور
   - Role: "Read and write to any database"

3. **إعداد الشبكة**
   - Network Access → Add IP Address
   - "Allow Access from Anywhere" (0.0.0.0/0)

4. **الحصول على Connection String**
   - Databases → Connect → "Connect your application"
   - انسخ الرابط
   - استبدل `<password>` بكلمة المرور
   - ضعه في `.env`:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/alawael-fields
     ```

## 📱 الاستخدام

### إنشاء مستخدم جديد

**API:**
```bash
POST http://your-domain.com/api/auth/register
Content-Type: application/json

{
  "username": "employee1",
  "email": "employee1@alawael.com",
  "password": "password123",
  "role": "employee"
}
```

### تسجيل الدخول

**API:**
```bash
POST http://your-domain.com/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### الواجهة الرسومية

1. افتح `http://your-domain.com`
2. أدخل اسم المستخدم وكلمة المرور
3. ابدأ باستخدام النظام!

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - تسجيل مستخدم جديد
- `POST /api/auth/login` - تسجيل الدخول
- `POST /api/auth/logout` - تسجيل الخروج
- `GET /api/auth/me` - الحصول على بيانات المستخدم الحالي

### Bookings
- `GET /api/bookings/:date` - جلب حجوزات يوم معين
- `POST /api/bookings` - إنشاء/تحديث حجز
- `DELETE /api/bookings/:date/:fieldId/:slotIndex` - حذف حجز
- `GET /api/bookings/archived/:date` - جلب الفترات المغلقة
- `POST /api/bookings/archive` - إغلاق/فتح فترة

## 🛡️ الأمان

- كلمات المرور مشفرة ب bcrypt
- JWT للمصادقة
- HttpOnly cookies
- حماية ضد CORS
- Validation للبيانات

## ⚙️ التخصيص

### تغيير عدد الملاعب
عدل في `public/index.html`:
```javascript
const FIELDS = [
    { id: 1, name: 'ملعب 1', price: 350 },
    // أضف المزيد هنا
];
```

### تغيير الفترات
عدل في `public/index.html`:
```javascript
const TIME_SLOTS = [
    '16:00 - 18:00',
    // أضف المزيد هنا
];
```

## 🐛 المشاكل الشائعة

**المشكلة: Cannot connect to MongoDB**
الحل: تأكد من:
- MongoDB يعمل
- Connection String صحيح في `.env`
- IP مسموح في MongoDB Atlas

**المشكلة: Port already in use**
الحل: غير المنفذ في `.env`:
```
PORT=3001
```

**المشكلة: JWT errors**
الحل: تأكد من `JWT_SECRET` في `.env`

## 📞 الدعم

للدعم أو الاستفسارات، يرجى التواصل مع المطور.

## 📄 الترخيص

MIT License - استخدم بحرية!

---

**صُنع بـ ❤️ لأكاديمية الأوائل ⚽**
