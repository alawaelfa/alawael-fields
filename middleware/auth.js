const jwt = require('jsonwebtoken');
const User = require('../models/User');

// التحقق من تسجيل الدخول
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // الحصول على التوكن من الكوكيز أو الهيدر
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'الرجاء تسجيل الدخول للوصول إلى هذا المحتوى'
      });
    }
    
    // التحقق من صلاحية التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // التحقق من وجود المستخدم
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }
    
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'حسابك غير نشط'
      });
    }
    
    // إضافة المستخدم إلى الطلب
    req.user = user;
    next();
    
  } catch (error) {
    console.error('خطأ في المصادقة:', error);
    return res.status(401).json({
      success: false,
      message: 'جلسة غير صالحة، الرجاء تسجيل الدخول مرة أخرى'
    });
  }
};

// التحقق من الصلاحيات
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'ليس لديك صلاحية للوصول إلى هذا المحتوى'
      });
    }
    next();
  };
};

// إنشاء التوكن
exports.signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};
