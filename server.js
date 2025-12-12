require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Serve main app for authenticated users
app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error('خطأ في السيرفر:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'حدث خطأ في السيرفر'
  });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
  
  // إنشاء مستخدم تجريبي (admin) إذا لم يكن موجوداً
  const User = require('./models/User');
  User.findOne({ username: 'admin' }).then(async (user) => {
    if (!user) {
      await User.create({
        username: 'admin',
        email: 'admin@alawael.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('✅ تم إنشاء حساب المدير التجريبي');
      console.log('   اسم المستخدم: admin');
      console.log('   كلمة المرور: admin123');
    }
  });
})
.catch((error) => {
  console.error('❌ خطأ في الاتصال بقاعدة البيانات:', error);
  process.exit(1);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 السيرفر يعمل على المنفذ ${PORT}`);
  console.log(`📱 الرابط: http://localhost:${PORT}`);
  console.log(`\n💡 للبدء:`);
  console.log(`   1. افتح المتصفح على: http://localhost:${PORT}`);
  console.log(`   2. سجل دخول بالحساب التجريبي:`);
  console.log(`      - اسم المستخدم: admin`);
  console.log(`      - كلمة المرور: admin123`);
  console.log(`\n⚽ نظام إدارة ملاعب الأوائل جاهز!\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ خطأ غير معالج:', err);
  process.exit(1);
});
