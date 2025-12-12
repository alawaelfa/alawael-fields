const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { signToken } = require('../middleware/auth');

// تسجيل مستخدم جديد
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    // التحقق من البيانات
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء إدخال جميع البيانات المطلوبة'
      });
    }
    
    // التحقق من عدم تكرار المستخدم
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'اسم المستخدم أو البريد الإلكتروني مستخدم بالفعل'
      });
    }
    
    // إنشاء المستخدم
    const user = await User.create({
      username,
      email,
      password,
      role: role || 'employee'
    });
    
    // إنشاء التوكن
    const token = signToken(user._id);
    
    // إرسال الكوكيز
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 أيام
    });
    
    res.status(201).json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('خطأ في التسجيل:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'حدث خطأ أثناء التسجيل'
    });
  }
});

// تسجيل الدخول
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // التحقق من البيانات
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء إدخال اسم المستخدم وكلمة المرور'
      });
    }
    
    // البحث عن المستخدم
    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'اسم المستخدم أو كلمة المرور غير صحيحة'
      });
    }
    
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'حسابك غير نشط، الرجاء التواصل مع الإدارة'
      });
    }
    
    // تحديث آخر تسجيل دخول
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });
    
    // إنشاء التوكن
    const token = signToken(user._id);
    
    // إرسال الكوكيز
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 أيام
    });
    
    res.status(200).json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('خطأ في تسجيل الدخول:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تسجيل الدخول'
    });
  }
});

// تسجيل الخروج
router.post('/logout', (req, res) => {
  res.cookie('jwt', 'logged-out', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000)
  });
  
  res.status(200).json({
    success: true,
    message: 'تم تسجيل الخروج بنجاح'
  });
});

// الحصول على بيانات المستخدم الحالي
router.get('/me', require('../middleware/auth').protect, async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role
    }
  });
});

module.exports = router;
