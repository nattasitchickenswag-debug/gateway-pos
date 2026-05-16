# 📌 PROMPT: Mini POS สำหรับ iPad (ร้านอาหาร)

## 🎯 เป้าหมาย
พัฒนา Web App (React + Vite) สำหรับใช้งานเป็น POS หน้าร้านบน iPad
เน้นใช้งานง่าย ปุ่มใหญ่ รองรับการขายจริง

---

## 🏪 ข้อมูลร้าน
- **ชื่อสาขา:** ไก่ย้อย & ขาหมูท่านลอร์ด สาขา ICS
- **อุปกรณ์:** iPad (หน้าจอใหญ่ ปุ่มชัด กดง่าย)

---

## ✅ สถานะการพัฒนา: **Core Features เสร็จสมบูรณ์**

**หมายเหตุ:** ระบบพร้อมใช้งานจริงแล้ว แต่ยังมีส่วนที่ต้องปรับปรุงเพิ่มเติม (ดูด้านล่าง)

### 🧭 โครงสร้างหน้า (4 หน้า)

#### ✅ 1. หน้าเปิดวัน (Open Day)
- [x] แสดงชื่อสาขา
- [x] ใส่เงินสดเปิดวัน (Opening Cash)
- [x] ปุ่ม "เปิดวัน" → ไปหน้าขาย
- [x] ปุ่ม "ดูยอดขายย้อนหลัง"
- [x] Auto-redirect ถ้าวันนี้เปิดไปแล้ว → เข้าแอปให้ไปหน้าขายอัตโนมัติ
- [x] เก็บข้อมูลใน localStorage (รีเฟรชแล้วไม่หาย)

#### ✅ 2. หน้าขาย (Sell Page) - **สำคัญที่สุด**
**Layout (เหมาะกับ iPad):**
- [x] ฝั่งซ้าย: เมนูอาหาร (Grid ปุ่มใหญ่)
- [x] ฝั่งขวา: ตะกร้า + สรุปเงิน

**เมนู:**
- [x] ดึงข้อมูลจาก `src/data/menu.js`
- [x] แยกหมวด: ข้าวมันไก่, ข้าวขาหมู, ชุดเซ็ต, เมนูเสริม
- [x] เรียงราคาจากน้อย → มาก
- [x] ปุ่มเมนูใหญ่ กดง่าย (iPad friendly)

**ตะกร้า:**
- [x] แสดงรายการที่เลือก
- [x] ปุ่ม +/- ปรับจำนวน
- [x] ลบรายการได้
- [x] แสดงชื่อเมนู, ราคา, จำนวน
- [x] แสดงยอดรวมทั้งหมด
- [x] **Scroll ได้เมื่อรายการเยอะ** (ไม่เลื่อนทั้งหน้า)

**ช่องทางการชำระเงิน:**
- [x] ให้เลือก 1 ช่องทางต่อบิล
- [x] 💵 เงินสด
- [x] 🏦 โอน
- [x] 🛵 LINE MAN (แยกช่องทาง)

**เงินสด:**
- [x] ใส่จำนวนเงินที่ลูกค้าจ่าย
- [x] ระบบคำนวณเงินทอนอัตโนมัติ
- [x] แสดงเงินทอนชัดเจน

**ปิดบิล:**
- [x] ปุ่ม "ปิดบิล"
- [x] บันทึกข้อมูลบิล: รายการอาหาร, ยอดรวม, ช่องทางชำระเงิน, เงินสดที่รับ/เงินทอน
- [x] เคลียร์ตะกร้าอัตโนมัติ
- [x] เก็บข้อมูลใน localStorage

**ปุ่มเสริม:**
- [x] ไปหน้าปิดวัน
- [x] ไปหน้าดูยอดขายย้อนหลัง (ดูได้ตลอด)

#### ✅ 3. หน้าปิดวัน (Close Day)
- [x] แสดงข้อมูล: ชื่อสาขา, วันที่, เวลาเปิดวัน/เวลาปิดวัน, เงินสดเปิดวัน
- [x] สรุปยอด: ยอดขายทั้งหมด
- [x] แยกตามช่องทาง: เงินสด, โอน, LINE MAN
- [x] แสดงเงินสดที่ควรมี: เงินเปิดวัน + ยอดขายเงินสด
- [x] ปุ่ม "กลับไปขายต่อ"
- [x] ปุ่ม "ยืนยันปิดวัน" → บันทึกเข้า history และเคลียร์วันปัจจุบัน

#### ✅ 4. หน้าดูยอดขายย้อนหลัง (Report)
- [x] แสดงรายการวันย้อนหลัง
- [x] กดเข้าไปดูรายละเอียดแต่ละวัน:
  - บิลทั้งหมด
  - ขายเมนูอะไร จำนวนเท่าไหร่
  - แยกยอดตามช่องทาง: เงินสด / โอน / LINE MAN
- [x] **เปิดได้ตลอด** (ไม่ล็อกเฉพาะหน้าเปิดวัน)
- [x] ข้อมูลไม่หายเมื่อรีเฟรช

---

## 💾 Data & Technical

### ✅ โครงสร้างข้อมูล
- [x] ใช้ React + Vite
- [x] เก็บข้อมูลด้วย localStorage
- [x] โครงข้อมูลรองรับ:
  - วันขาย (date, openTime, closeTime, openCash)
  - บิล (time, cart, total, payment, cashReceived, change)
  - รายการอาหาร (id, name, price, qty)
  - ช่องทางชำระเงิน (cash, transfer, lineman)

### ✅ State Management
- [x] แยก state ชัดเจน:
  - Navigation (page)
  - Business state (dayData, history)
  - UI state (cart, payment, cashReceived)

---

## 🎨 UI/UX

### ✅ ออกแบบสำหรับ iPad
- [x] ปุ่มใหญ่ (font-size 18-28px)
- [x] ตัวหนังสืออ่านง่าย
- [x] Grid ชัดเจน
- [x] Layout ซ้าย-ขวา (เมนู | ตะกร้า)
- [x] สีสันและ spacing เหมาะสม
- [x] Scrollbar สวยงาม
- [x] Responsive design

### ✅ CSS Features
- [x] Flexbox layout
- [x] Grid layout สำหรับเมนู
- [x] Hover effects
- [x] Active states
- [x] Scrollable cart section
- [x] Fixed header

---

## 📁 โครงสร้างไฟล์

```
mini pos/
├── src/
│   ├── App.jsx          # Component หลัก (518 บรรทัด)
│   ├── App.css          # Styles (761 บรรทัด)
│   ├── data/
│   │   └── menu.js      # ข้อมูลเมนู (4 หมวด)
│   └── main.jsx         # Entry point
├── package.json
└── PROMPT.md           # ไฟล์นี้
```

---

## 📋 เมนูอาหาร (4 หมวด)

1. **ข้าวมันไก่** (9 รายการ)
2. **ข้าวขาหมู** (12 รายการ)
3. **ชุดเซ็ต** (4 รายการ)
4. **เมนูเสริม** (8 รายการ)

**หมายเหตุ:** เมนูเรียงราคาจากน้อย→มากในแต่ละหมวด

---

## 🚀 การใช้งาน

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

---

## 🔧 Technical Stack

- **React 19.2.0**
- **Vite 7.2.4**
- **CSS3** (Flexbox, Grid)
- **localStorage** (Data persistence)

---

## 📝 หมายเหตุสำหรับการพัฒนาต่อ

1. **เมนู:** ข้อมูลอยู่ใน `src/data/menu.js` - แก้ไขที่นี่
2. **ชื่อสาขา:** แก้ไขที่ `BRANCH_NAME` ใน `App.jsx`
3. **localStorage Keys:**
   - `currentDay` - ข้อมูลวันปัจจุบัน
   - `history` - ประวัติย้อนหลัง

4. **Payment Methods:**
   - `cash` - เงินสด
   - `transfer` - โอน
   - `lineman` - LINE MAN

5. **Auto-redirect Logic:**
   - เช็ควันที่ปัจจุบันกับวันที่ใน localStorage
   - ถ้าเป็นวันเดียวกัน → ไปหน้าขายอัตโนมัติ

---

## 🔴 1️⃣ สิ่งที่ยังขาด (สำคัญจริง)

### 🔴 1. นิยาม "วันเดียวกัน" (Business Day Logic)

**❌ ปัญหา:**
- ตอนนี้เขียนว่า "Auto-redirect ถ้าวันนี้เปิดไปแล้ว"
- แต่ยังไม่กำหนด logic ชัดเจนว่า:
  - วันใหม่เริ่มกี่โมง?
  - ถ้าร้านเปิดข้ามวัน (เช่น 18:00 – 02:00) จะนับยังไง?

**✅ วิธีแก้:**
- **วันขาย (Business Day)** ใช้วันที่ตามการกด "เปิดวัน"
- **ไม่เปลี่ยนวันอัตโนมัติ** เมื่อข้ามเที่ยงคืน
- **วันใหม่เริ่มเมื่อกด "เปิดวัน" เท่านั้น**
- ใช้ `date` field ใน dayData เป็นหลัก (ไม่ใช่ system date)

**📌 Implementation:**
```javascript
// วันใหม่ = เมื่อกด "เปิดวัน" เท่านั้น
// ไม่ใช่เมื่อ system date เปลี่ยน
// รองรับร้านเปิดข้ามวันได้
```

### 🔴 2. ระบบป้องกันข้อมูลหายเมื่อรีเฟรชกลางบิล

**❌ ปัญหา:**
- แม้จะบอกว่าใช้ localStorage แต่ยังไม่ระบุว่า:
  - cart ต้อง persist ไหม?
  - payment ที่เลือกอยู่ต้องไม่หายไหม?
- **สำคัญมาก** - หน้าร้านเจอจริง (รีเฟรชโดยไม่ตั้งใจ)

**✅ วิธีแก้:**
- **cart state ต้อง sync กับ localStorage**
- **payment state ต้อง sync กับ localStorage**
- รีเฟรชหน้าแล้วบิลที่กำลังทำอยู่ต้องไม่หาย
- เก็บใน localStorage key: `currentCart`, `currentPayment`

**📌 Implementation:**
```javascript
// เก็บ cart และ payment ใน localStorage
// โหลดเมื่อ component mount
// sync ทุกครั้งที่ state เปลี่ยน
```

### 🔴 3. Error / Validation Rules

**❌ ปัญหา:**
- ยังไม่มี validation rules เช่น:
  - เงินสดที่รับ < ยอดรวม
  - ยังไม่เลือกช่องทาง แต่กดปิดบิล
  - เงินสดเป็นค่าว่าง / ติดลบ

**✅ Validation Rules ที่ต้องมี:**

1. **ปิดบิล:**
   - ❌ ห้ามปิดบิลถ้ายังไม่เลือกช่องทางชำระเงิน
   - ❌ ห้ามปิดบิลถ้าตะกร้าว่าง
   - ❌ ห้ามปิดบิลถ้าเลือกเงินสด แต่เงินที่รับ < ยอดรวม
   - ❌ ห้ามปิดบิลถ้าเงินสดเป็นค่าว่าง / ติดลบ

2. **เงินสด:**
   - ✅ เงินสดที่รับต้อง ≥ ยอดรวม
   - ✅ ต้องเป็นตัวเลขบวกเท่านั้น
   - ✅ แสดง error message ชัดเจน (ไม่ใช้ alert)

3. **เปิดวัน:**
   - ❌ ห้ามเปิดวันถ้าเงินสดเปิดวันเป็นค่าว่าง / ติดลบ
   - ✅ ต้องเป็นตัวเลขบวกเท่านั้น

**📌 Error Display:**
- แสดง error message ใน UI (ไม่ใช้ `alert()`)
- ใช้สีแดง, ไอคอน, หรือ highlight
- แสดงใต้ input หรือปุ่มที่เกี่ยวข้อง

---

## 🟠 2️⃣ สิ่งที่ยังไม่ชัด (AI อาจทำเพี้ยน)

### 🟠 4. LINE MAN Flow ยังไม่ระบุชัด

**❌ ปัญหา:**
- ตอนนี้บอกแค่ว่าเป็นช่องทางหนึ่ง
- แต่ควรชัดว่า:
  - LINE MAN ไม่ต้องใส่เงินสด
  - LINE MAN ไม่เอาเงินทอน
  - LINE MAN นับเป็น "ยอดขายนอกหน้าร้าน"

**✅ LINE MAN Behavior:**

- **ไม่ต้องกรอกเงินที่รับ** (ไม่มี input field)
- **ไม่มีเงินทอน** (ไม่มี change calculation)
- **แยกยอดออกจากเงินสดหน้าร้าน** (ในรายงาน)
- **ถือเป็นยอดขายออนไลน์** (ไม่นับรวมในเงินสดที่ควรมี)

**📌 Implementation:**
```javascript
if (payment === "lineman") {
  // ไม่แสดง cash input
  // ไม่คำนวณ change
  // ไม่นับรวมใน cashSales
}
```

### 🟠 5. ปิดวัน: "ดูอย่างเดียว" vs "ยืนยัน"

**❌ ปัญหา:**
- หน้าปิดวันยังไม่ lock behavior ชัดเจน
- อาจทำให้สับสนระหว่าง "ดูยอด" กับ "ยืนยันปิดวัน"

**✅ หน้าปิดวันแบ่งเป็น 2 โหมด:**

1. **Preview Mode (ดูยอดเฉย ๆ):**
   - แสดงข้อมูลทั้งหมด
   - ปุ่ม "กลับไปขายต่อ" → กลับไปหน้าขายได้
   - **ยังไม่ปิดวัน** (ยังขายต่อได้)

2. **Confirm Mode (ยืนยันปิดวัน):**
   - กด "ยืนยันปิดวัน" → แสดง confirmation dialog
   - **Irreversible** - ไม่สามารถยกเลิกได้
   - บันทึกเข้า history และเคลียร์วันปัจจุบัน

**📌 UX Flow:**
```
ปิดวัน → Preview → ยืนยันปิดวัน → Confirmation Dialog → ยืนยัน → ปิดวันสำเร็จ
                ↓
          กลับไปขายต่อ
```

### 🟠 6. History เรียงลำดับและการค้นหา

**❌ ปัญหา:**
- ตอนนี้บอกว่า "ดูย้อนหลังได้" แต่ยังไม่ระบุ UX
- ไม่ชัดว่าเรียงยังไง, ค้นหายังไง

**✅ History UX:**

1. **เรียงลำดับ:**
   - เรียงจากวันล่าสุด → เก่าสุด (newest first)
   - ใช้ `date` + `openTime` เป็นหลัก

2. **การแสดงผล:**
   - แสดงรายการวันย้อนหลังแบบ list
   - กดดูรายละเอียดแต่ละวันแบบ drill-down (expand/collapse)
   - แสดงยอดขายรวมของแต่ละวันใน summary

3. **รายละเอียดแต่ละวัน:**
   - แสดงบิลทั้งหมด
   - แสดงรายการเมนูที่ขาย
   - แยกยอดตามช่องทาง

**📌 Implementation:**
```javascript
// เรียง history จากใหม่ → เก่า
history.sort((a, b) => {
  const dateA = new Date(a.date + " " + a.openTime);
  const dateB = new Date(b.date + " " + b.openTime);
  return dateB - dateA;
});
```

---

## 🟢 3️⃣ สิ่งที่ควรเพิ่ม (เพื่อใช้งานจริงระยะยาว)

### 🟢 7. Export รายงาน

**📌 Future Feature:**
- Export รายงานรายวันเป็น Excel / CSV
- Export รายงานรายวันเป็น PDF
- Export ประวัติทั้งหมด

**📌 Implementation Notes:**
- ใช้ library เช่น `xlsx` สำหรับ Excel
- ใช้ library เช่น `jspdf` สำหรับ PDF
- หรือใช้ browser print function

### 🟢 8. Reset / Clear Data สำหรับ Admin

**📌 Future Feature:**
- Admin action: ล้างข้อมูลทั้งหมด (clear localStorage)
- ต้องมี confirmation 2 ชั้น:
  1. กดปุ่ม "ล้างข้อมูล"
  2. พิมพ์คำว่า "ยืนยัน" หรือ "DELETE"
  3. กดยืนยันอีกครั้ง

**📌 Safety:**
- แสดง warning message ชัดเจน
- แสดงข้อมูลที่จะถูกลบ (จำนวนวัน, จำนวนบิล)
- ไม่สามารถยกเลิกได้หลังจากยืนยัน

### 🟢 9. Version / Migration

**📌 Future Feature:**
- เก็บ `appVersion` ใน localStorage
- รองรับ migration ข้อมูลในอนาคต
- ถ้า version เก่า → migrate อัตโนมัติ

**📌 Implementation:**
```javascript
const APP_VERSION = "1.0.0";
localStorage.setItem("appVersion", APP_VERSION);

// Migration logic
if (localStorage.getItem("appVersion") !== APP_VERSION) {
  migrateData();
}
```

---

## ✨ Features ที่ทำเสร็จแล้ว

- ✅ 4 หน้าหลัก (เปิดวัน, ขาย, ปิดวัน, รายงาน)
- ✅ ระบบตะกร้า (เพิ่ม/ลบ/ปรับจำนวน)
- ✅ 3 ช่องทางชำระเงิน (เงินสด/โอน/LINE MAN)
- ✅ คำนวณเงินทอนอัตโนมัติ
- ✅ บันทึกบิลและประวัติ
- ✅ Auto-redirect ถ้าวันนี้เปิดไปแล้ว
- ✅ Scrollable cart section
- ✅ Responsive design สำหรับ iPad
- ✅ Data persistence ด้วย localStorage

---

## 🎯 สรุป

**ระบบ Mini POS พร้อมใช้งานแล้ว!** 

- ✅ ทุกฟีเจอร์ตาม requirements
- ✅ UI/UX เหมาะกับ iPad
- ✅ เก็บข้อมูลได้ครบถ้วน
- ✅ ใช้งานง่าย ปุ่มใหญ่

**พร้อมสำหรับ:**
- การใช้งานจริงในร้าน
- การ deploy ไปยัง production
- การปรับแต่งเพิ่มเติมตามต้องการ

---

---

## 📊 สรุปสถานะ

### ✅ ทำเสร็จแล้ว
- 4 หน้าหลัก (เปิดวัน, ขาย, ปิดวัน, รายงาน)
- ระบบตะกร้า (เพิ่ม/ลบ/ปรับจำนวน)
- 3 ช่องทางชำระเงิน (เงินสด/โอน/LINE MAN)
- คำนวณเงินทอนอัตโนมัติ
- บันทึกบิลและประวัติ
- Auto-redirect ถ้าวันนี้เปิดไปแล้ว
- Scrollable cart section
- Responsive design สำหรับ iPad
- Data persistence ด้วย localStorage

### 🔴 ต้องเพิ่ม (สำคัญจริง)
- [ ] นิยาม Business Day Logic (วันใหม่เริ่มเมื่อกดเปิดวัน)
- [ ] ระบบป้องกันข้อมูลหาย (persist cart + payment)
- [ ] Validation Rules (error handling)

### 🟠 ควรชัดเจน (ป้องกัน AI ทำเพี้ยน)
- [ ] LINE MAN Flow (ไม่ต้องเงินสด, ไม่มีเงินทอน)
- [ ] ปิดวัน Preview vs Confirm Mode
- [ ] History เรียงลำดับและ UX

### 🟢 Future Features (ระยะยาว)
- [ ] Export รายงาน (Excel/PDF)
- [ ] Reset/Clear Data (Admin)
- [ ] Version/Migration System

---

## 🎯 Next Steps: สิ่งที่ AI คนอื่นควรทำต่อ

### 🔴 Priority 1: Critical (ต้องทำก่อนใช้งานจริง)

#### 1. Implement Business Day Logic
**Task:** ปรับปรุง logic การเช็ควันเดียวกัน
- [ ] แก้ไข `App.jsx` ให้ใช้ `dayData.date` เป็นหลัก (ไม่ใช่ system date)
- [ ] วันใหม่เริ่มเมื่อกด "เปิดวัน" เท่านั้น
- [ ] รองรับร้านเปิดข้ามวัน (18:00 - 02:00)
- [ ] Test case: เปิดวัน 23:00 → ข้ามเที่ยงคืน → ยังเป็นวันเดิม

**Files to modify:**
- `src/App.jsx` - Auto-redirect logic

#### 2. Persist Cart & Payment State
**Task:** เก็บ cart และ payment ใน localStorage
- [ ] เพิ่ม localStorage keys: `currentCart`, `currentPayment`
- [ ] Sync cart state ทุกครั้งที่เพิ่ม/ลบ/ปรับจำนวน
- [ ] Sync payment state ทุกครั้งที่เปลี่ยนช่องทาง
- [ ] โหลด cart + payment เมื่อ component mount
- [ ] Test case: เพิ่มสินค้า → รีเฟรช → ต้องยังมีสินค้าในตะกร้า

**Files to modify:**
- `src/App.jsx` - Cart & Payment state management

#### 3. Add Validation Rules
**Task:** เพิ่ม validation และ error handling
- [ ] Validation สำหรับปิดบิล:
  - [ ] ห้ามปิดบิลถ้าตะกร้าว่าง
  - [ ] ห้ามปิดบิลถ้ายังไม่เลือกช่องทางชำระเงิน
  - [ ] ห้ามปิดบิลถ้าเงินสด < ยอดรวม
- [ ] Validation สำหรับเงินสด:
  - [ ] ต้องเป็นตัวเลขบวก
  - [ ] ห้ามค่าว่าง/ติดลบ
- [ ] Validation สำหรับเปิดวัน:
  - [ ] เงินสดเปิดวันต้องเป็นตัวเลขบวก
- [ ] แสดง error message ใน UI (ไม่ใช้ `alert()`)
- [ ] สร้าง component `ErrorMessage` หรือใช้ inline error

**Files to modify:**
- `src/App.jsx` - Validation logic
- `src/App.css` - Error message styles (optional)

---

### 🟠 Priority 2: Important (ควรทำให้ชัดเจน)

#### 4. Clarify LINE MAN Flow
**Task:** ปรับปรุง UX สำหรับ LINE MAN
- [ ] ซ่อน cash input เมื่อเลือก LINE MAN
- [ ] ไม่คำนวณ change สำหรับ LINE MAN
- [ ] แยกยอด LINE MAN ออกจาก cashSales ในรายงาน
- [ ] แสดงข้อความชัดเจนว่า LINE MAN ไม่ต้องเงินสด

**Files to modify:**
- `src/App.jsx` - Payment method UI logic
- `src/App.jsx` - Close day calculation

#### 5. Improve Close Day UX
**Task:** แยก Preview vs Confirm Mode
- [ ] เพิ่ม confirmation dialog เมื่อกด "ยืนยันปิดวัน"
- [ ] แสดง warning message: "การปิดวันไม่สามารถยกเลิกได้"
- [ ] ปุ่ม "ยกเลิก" ใน confirmation dialog
- [ ] ปรับปรุง UX ให้ชัดเจนว่า Preview vs Confirm

**Files to modify:**
- `src/App.jsx` - Close day confirmation logic
- `src/App.css` - Modal/Dialog styles (optional)

#### 6. Improve History UX
**Task:** ปรับปรุงการแสดงประวัติ
- [ ] เรียง history จากใหม่ → เก่า (newest first)
- [ ] ใช้ `date` + `openTime` เป็นหลักในการเรียง
- [ ] ปรับปรุง UI ให้ดูง่ายขึ้น (อาจใช้ accordion หรือ tabs)

**Files to modify:**
- `src/App.jsx` - History sorting logic

---

### 🟢 Priority 3: Future (ระยะยาว)

#### 7. Export Reports
**Task:** เพิ่มฟีเจอร์ export รายงาน
- [ ] ติดตั้ง library: `xlsx` สำหรับ Excel, `jspdf` สำหรับ PDF
- [ ] สร้าง function `exportToExcel(dayData)`
- [ ] สร้าง function `exportToPDF(dayData)`
- [ ] เพิ่มปุ่ม "Export" ในหน้าปิดวันและหน้าดูย้อนหลัง

**Dependencies to add:**
```bash
npm install xlsx jspdf
```

**Files to create:**
- `src/utils/export.js` - Export functions

#### 8. Admin Reset Function
**Task:** เพิ่มฟีเจอร์ล้างข้อมูล
- [ ] สร้างหน้า Admin หรือ modal
- [ ] ปุ่ม "ล้างข้อมูลทั้งหมด"
- [ ] Confirmation 2 ชั้น:
  - [ ] พิมพ์คำว่า "DELETE" หรือ "ยืนยัน"
  - [ ] แสดงข้อมูลที่จะถูกลบ (จำนวนวัน, จำนวนบิล)
- [ ] Clear localStorage ทั้งหมด

**Files to create/modify:**
- `src/App.jsx` - Admin reset function
- `src/App.css` - Admin modal styles

#### 9. Version & Migration System
**Task:** เพิ่มระบบ version control
- [ ] กำหนด `APP_VERSION = "1.0.0"` ใน config
- [ ] เก็บ version ใน localStorage
- [ ] สร้าง migration function สำหรับอนาคต
- [ ] เช็ค version เมื่อ app start

**Files to create/modify:**
- `src/config.js` - App version
- `src/utils/migration.js` - Migration logic
- `src/App.jsx` - Version check on mount

---

## 📋 Quick Start Guide สำหรับ AI คนอื่น

### ขั้นตอนที่ 1: อ่านและเข้าใจ
1. อ่าน `PROMPT.md` ทั้งหมด
2. อ่าน `src/App.jsx` เพื่อเข้าใจโครงสร้าง
3. ทดสอบระบบด้วย `npm run dev`

### ขั้นตอนที่ 2: เลือก Task
- **ถ้าต้องการใช้งานจริงทันที:** ทำ Priority 1 ทั้งหมด
- **ถ้าต้องการปรับปรุง UX:** ทำ Priority 2
- **ถ้าต้องการเพิ่มฟีเจอร์:** ทำ Priority 3

### ขั้นตอนที่ 3: Development
1. สร้าง branch หรือ backup โค้ดเดิม
2. ทำทีละ task ตาม checklist
3. Test ทุกครั้งที่ทำเสร็จ
4. อัปเดต `PROMPT.md` เมื่อทำเสร็จ (เปลี่ยน `[ ]` เป็น `[x]`)

### ขั้นตอนที่ 4: Testing Checklist
- [ ] ทดสอบเปิดวัน → ขาย → ปิดวัน
- [ ] ทดสอบรีเฟรชกลางบิล (cart ต้องไม่หาย)
- [ ] ทดสอบ validation (ลองปิดบิลโดยไม่เลือกช่องทาง)
- [ ] ทดสอบ LINE MAN (ไม่ต้องเงินสด)
- [ ] ทดสอบข้ามเที่ยงคืน (วันต้องไม่เปลี่ยน)

---

## 🔍 Code Review Checklist

ก่อน commit โค้ด ตรวจสอบ:
- [ ] ไม่มี console.log() เหลืออยู่
- [ ] Error handling ครบถ้วน
- [ ] Validation ทำงานถูกต้อง
- [ ] UI/UX สอดคล้องกับ iPad
- [ ] localStorage ทำงานถูกต้อง
- [ ] ไม่มี hardcoded values (ยกเว้น config)

---

**Last Updated:** 2026-01-09
**Status:** ✅ Core Features Complete | 🔴 Critical Improvements Needed
