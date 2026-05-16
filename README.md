# 🏪 Mini POS สำหรับ iPad

Web Application สำหรับใช้งานเป็น POS หน้าร้านบน iPad สำหรับร้าน **ไก่ย้อย & ขาหมูท่านลอร์ด สาขา ICS**

## ✨ Features

- 📱 **ออกแบบสำหรับ iPad** - ปุ่มใหญ่ ใช้งานง่าย
- 🛒 **ระบบตะกร้า** - เพิ่ม/ลบ/ปรับจำนวนสินค้า
- 💳 **3 ช่องทางชำระเงิน** - เงินสด, โอน, LINE MAN
- 💰 **คำนวณเงินทอนอัตโนมัติ**
- 📊 **รายงานย้อนหลัง** - ดูยอดขายและรายละเอียดบิล
- 💾 **เก็บข้อมูลใน localStorage** - ไม่หายเมื่อรีเฟรช

## 🚀 การติดตั้งและใช้งาน

### ติดตั้ง Dependencies
```bash
npm install
```

### รัน Development Server
```bash
npm run dev
```

### Build สำหรับ Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📋 หน้าหลัก

1. **หน้าเปิดวัน** - ใส่เงินสดเปิดวัน
2. **หน้าขาย** - เลือกเมนู, จัดการตะกร้า, ปิดบิล
3. **หน้าปิดวัน** - สรุปยอดขายและยืนยันปิดวัน
4. **หน้าดูย้อนหลัง** - ดูรายงานย้อนหลัง

## 🛠️ Tech Stack

- React 19.2.0
- Vite 7.2.4
- CSS3 (Flexbox, Grid)

## 📁 โครงสร้างโปรเจกต์

```
src/
├── App.jsx          # Component หลัก
├── App.css          # Styles
├── data/
│   └── menu.js      # ข้อมูลเมนู
└── main.jsx         # Entry point
```

## 📝 ดูรายละเอียดเพิ่มเติม

ดูไฟล์ `PROMPT.md` สำหรับรายละเอียดครบถ้วนของ requirements และสิ่งที่ทำเสร็จแล้ว

---

**Status:** ✅ Ready for Production
