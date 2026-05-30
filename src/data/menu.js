export const menu = [
  {
    category: "ข้าวมันไก่",
    items: [
      { id: 1, name: "ข้าวมันไก่ตอน ธรรมดา", price: 70, grabPrice: 90 },
      { id: 2, name: "ข้าวมันไก่ตอน พิเศษ", price: 90, grabPrice: 110 },
      { id: 3, name: "ข้าวมันไก่กรอบ ธรรมดา", price: 70, grabPrice: 90 },
      { id: 4, name: "ข้าวมันไก่กรอบ พิเศษ", price: 90, grabPrice: 110 },
      { id: 5, name: "ข้าวมันไก่ผสม", price: 100, grabPrice: 120 },
    ].sort((a, b) => a.price - b.price),
  },
  {
    category: "จานสับ",
    items: [
      { id: 10, name: "เครื่องในสับ (เล็ก)", price: 80 },
      { id: 11, name: "เครื่องในสับ (ใหญ่)", price: 140 },
      { id: 12, name: "ไก่ตอนสับ (เล็ก)", price: 120, grabPrice: 145 },
      { id: 13, name: "ไก่ตอนสับ (ใหญ่)", price: 240, grabPrice: 285 },
      { id: 14, name: "ไก่กรอบสับ (เล็ก)", price: 120, grabPrice: 145 },
      { id: 15, name: "ไก่กรอบสับ (ใหญ่)", price: 240, grabPrice: 285 },
    ].sort((a, b) => a.price - b.price),
  },
  {
    category: "Combo จับคู่",
    items: [
      { id: 20, name: "ไก่ตอน + ซุปผักกาดดอง", price: 120, grabPrice: 170 },
      { id: 21, name: "ไก่กรอบ + ซุปผักกาดดอง", price: 120, grabPrice: 170 },
      { id: 22, name: "ไก่ตอน + ซุปเปอร์แซ่บ", price: 120, grabPrice: 170 },
      { id: 23, name: "ไก่กรอบ + ซุปเปอร์แซ่บ", price: 120, grabPrice: 170 },
      { id: 24, name: "ไก่ผสม + ซุปผักกาดดอง", price: 159, grabPrice: 195 },
      { id: 25, name: "ไก่ผสม + ซุปเปอร์แซ่บ", price: 159, grabPrice: 195 },
    ].sort((a, b) => a.price - b.price),
  },
  {
    category: "ท้อปปิ้ง",
    items: [
      { id: 40, name: "ตับ", price: 20 },
    ].sort((a, b) => a.price - b.price),
  },
  {
    category: "เมนูเสริม",
    items: [
      { id: 30, name: "ไข่ตาหวาน", price: 20 },
      { id: 31, name: "ข้าวมัน", price: 25, grabPrice: 35 },
      { id: 32, name: "ซุปผักกาดดองกระดูกหมู", price: 80, grabPrice: 90 },
      { id: 33, name: "ซุปเปอร์แซ่บ", price: 80, grabPrice: 90 },
      { id: 34, name: "คะน้าฮ่องกงน้ำมันหอย", price: 110, grabPrice: 120 },
      { id: 35, name: "ขาไก่พะโล้", price: 130, grabPrice: 170 },
      { id: 36, name: "กล่อง", price: 5 },
      { id: 37, name: "ข้าวสวย", price: 15 },
    ].sort((a, b) => a.price - b.price),
  },
];
