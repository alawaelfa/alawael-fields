const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const ArchivedSlot = require('../models/ArchivedSlot');
const { protect } = require('../middleware/auth');

// حماية جميع المسارات
router.use(protect);

// الحصول على جميع الحجوزات لتاريخ معين
router.get('/:date', async (req, res) => {
  try {
    const { date } = req.params;
    
    const bookings = await Booking.find({
      userId: req.user._id,
      date: date
    });
    
    // تحويل إلى صيغة مفتاح-قيمة
    const bookingsData = {};
    bookings.forEach(booking => {
      const key = `${date}_field_${booking.fieldId}_slot_${booking.slotIndex}`;
      bookingsData[key] = booking;
    });
    
    res.status(200).json({
      success: true,
      bookings: bookingsData
    });
    
  } catch (error) {
    console.error('خطأ في جلب الحجوزات:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الحجوزات'
    });
  }
});

// حفظ أو تحديث حجز
router.post('/', async (req, res) => {
  try {
    const { date, fieldId, slotIndex, ...bookingData } = req.body;
    
    // البحث عن حجز موجود
    const existingBooking = await Booking.findOne({
      userId: req.user._id,
      date,
      fieldId,
      slotIndex
    });
    
    if (existingBooking) {
      // تحديث الحجز الموجود
      Object.assign(existingBooking, bookingData);
      await existingBooking.save();
      
      res.status(200).json({
        success: true,
        message: 'تم تحديث الحجز بنجاح',
        booking: existingBooking
      });
    } else {
      // إنشاء حجز جديد
      const booking = await Booking.create({
        userId: req.user._id,
        date,
        fieldId,
        slotIndex,
        ...bookingData
      });
      
      res.status(201).json({
        success: true,
        message: 'تم إنشاء الحجز بنجاح',
        booking
      });
    }
    
  } catch (error) {
    console.error('خطأ في حفظ الحجز:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء حفظ الحجز'
    });
  }
});

// حذف حجز
router.delete('/:date/:fieldId/:slotIndex', async (req, res) => {
  try {
    const { date, fieldId, slotIndex } = req.params;
    
    const booking = await Booking.findOneAndDelete({
      userId: req.user._id,
      date,
      fieldId: parseInt(fieldId),
      slotIndex: parseInt(slotIndex)
    });
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'الحجز غير موجود'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'تم حذف الحجز بنجاح'
    });
    
  } catch (error) {
    console.error('خطأ في حذف الحجز:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء حذف الحجز'
    });
  }
});

// الحصول على الفترات المغلقة
router.get('/archived/:date', async (req, res) => {
  try {
    const { date } = req.params;
    
    const archivedSlots = await ArchivedSlot.find({
      userId: req.user._id,
      date
    });
    
    const result = {};
    archivedSlots.forEach(slot => {
      result[slot.slotKey] = slot.isArchived;
    });
    
    res.status(200).json({
      success: true,
      archivedSlots: result
    });
    
  } catch (error) {
    console.error('خطأ في جلب الفترات المغلقة:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الفترات المغلقة'
    });
  }
});

// إغلاق/فتح فترة
router.post('/archive', async (req, res) => {
  try {
    const { slotKey, date, slotIndex, isArchived } = req.body;
    
    if (isArchived) {
      // إضافة إلى المغلقة
      await ArchivedSlot.findOneAndUpdate(
        { userId: req.user._id, slotKey },
        { userId: req.user._id, slotKey, date, slotIndex, isArchived: true },
        { upsert: true, new: true }
      );
    } else {
      // حذف من المغلقة
      await ArchivedSlot.findOneAndDelete({
        userId: req.user._id,
        slotKey
      });
    }
    
    res.status(200).json({
      success: true,
      message: isArchived ? 'تم إغلاق الفترة' : 'تم فتح الفترة'
    });
    
  } catch (error) {
    console.error('خطأ في تحديث حالة الفترة:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث حالة الفترة'
    });
  }
});

module.exports = router;
