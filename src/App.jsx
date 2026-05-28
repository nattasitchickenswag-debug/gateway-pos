import { useEffect, useState } from "react";
import { menu } from "./data/menu.js";
import "./App.css";

/* ------------------ CONFIG ------------------ */
const BRANCH_NAME = "ไก่ย้อย สาขาเกตเวย์ บางซื่อ";
const LINEMAN_MARKUP = 1.2;

const findMenuItem = (id) => {
  for (const cat of menu) {
    const found = cat.items.find((i) => i.id === id);
    if (found) return found;
  }
  return null;
};

const getEffectivePrice = (item, paymentMethod) => {
  if ((paymentMethod === "grab" || paymentMethod === "lineman") && item.deliveryPrice !== undefined) {
    return item.deliveryPrice;
  }
  const menuItem = findMenuItem(item.id) ?? item;
  if (paymentMethod === "grab") return menuItem.grabPrice ?? menuItem.price;
  if (paymentMethod === "lineman") return Math.round(menuItem.price * LINEMAN_MARKUP);
  return menuItem.price;
};

/* ------------------ APP ------------------ */
export default function App() {
  const [page, setPage] = useState(() => {
    const storedPage = localStorage.getItem("currentPage");
    if (storedPage) return storedPage;
    const storedDay = localStorage.getItem("currentDay");
    return storedDay ? "sell" : "open";
  });

  const [openCash, setOpenCash] = useState("");

  // Persist cart state
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("currentCart");
    return stored ? JSON.parse(stored) : [];
  });

  // Persist payment state
  const [payment, setPayment] = useState(() => {
    const stored = localStorage.getItem("currentPayment");
    return stored || "cash";
  });

  const [cashReceived, setCashReceived] = useState(() => {
    const stored = localStorage.getItem("currentCashReceived");
    return stored || "";
  });

  const [linemanOrderId, setLinemanOrderId] = useState(() => {
    return localStorage.getItem("currentLinemanOrderId") || "";
  });

  const [grabOrderId, setGrabOrderId] = useState(() => {
    return localStorage.getItem("currentGrabOrderId") || "";
  });

  const [dayData, setDayData] = useState(() => {
    const stored = localStorage.getItem("currentDay");
    if (!stored) return null;
    const data = JSON.parse(stored);
    // Auto-redirect ถ้าวันนี้เปิดไปแล้ว
    const today = new Date().toLocaleDateString("th-TH");
    if (data && data.date === today) {
      return data;
    }
    return null;
  });

  const [history, setHistory] = useState(() => {
    return JSON.parse(localStorage.getItem("history")) || [];
  });

  // Close-day extra fields
  const [linemanInput, setLinemanInput] = useState("");
  const [grabInput, setGrabInput] = useState("");
  const [kaiTon, setKaiTon] = useState("");
  const [nongSaPok, setNongSaPok] = useState("");
  // Load dayData from Local Storage when component mounts
  useEffect(() => {
    const storedDayData = localStorage.getItem("currentDay");
    if (storedDayData) {
      setDayData(JSON.parse(storedDayData));
    }
  }, []);
  // Auto-redirect to sell page if day is already open

  /* ---------- Persist ---------- */
  useEffect(() => {
    if (dayData) {
      localStorage.setItem("currentDay", JSON.stringify(dayData));
    }
  }, [dayData]);

  useEffect(() => {
    localStorage.setItem("history", JSON.stringify(history));
  }, [history]);

  // Persist cart state
  useEffect(() => {
    localStorage.setItem("currentCart", JSON.stringify(cart));
  }, [cart]);

  // Persist payment state
  useEffect(() => {
    localStorage.setItem("currentPayment", payment);
  }, [payment]);

  // Persist cashReceived state
  useEffect(() => {
    if (cashReceived) {
      localStorage.setItem("currentCashReceived", cashReceived);
    } else {
      localStorage.removeItem("currentCashReceived");
    }
  }, [cashReceived]);

  // Persist linemanOrderId state
  useEffect(() => {
    if (linemanOrderId) {
      localStorage.setItem("currentLinemanOrderId", linemanOrderId);
    } else {
      localStorage.removeItem("currentLinemanOrderId");
    }
  }, [linemanOrderId]);

  // Persist grabOrderId state
  useEffect(() => {
    if (grabOrderId) {
      localStorage.setItem("currentGrabOrderId", grabOrderId);
    } else {
      localStorage.removeItem("currentGrabOrderId");
    }
  }, [grabOrderId]);

  // Persist page state
  useEffect(() => {
    localStorage.setItem("currentPage", page);
  }, [page]);

  /* ---------- Printing ---------- */
  const [printData, setPrintData] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [lastBill, setLastBill] = useState(null);
  const [editingBill, setEditingBill] = useState(null);
  const [editTotalValue, setEditTotalValue] = useState("");

  useEffect(() => {
    if (printData) {
      const timer = setTimeout(() => {
        window.print();
        setPrintData(null);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [printData]);

  const generateReceiptHTML = (printData) => {
    const { type, data } = printData;

    // Common Styles
    // Adjusted for better clarity and width on 80mm paper
    // Using sans-serif for thicker lines than Courier
    // Increased base font size
    const style = `
      <style>
        @page { margin: 0; }
        body { 
          font-family: 'Helvetica', 'Arial', sans-serif; 
          font-size: 18px; 
          margin: 0; 
          padding: 5px 15px 5px 5px; 
          width: 100%; 
          box-sizing: border-box;
          background: #fff; 
          color: #000; 
          line-height: 1.2;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .bold { font-weight: bold; }
        .header { margin-bottom: 10px; border-bottom: 2px dashed #000; padding-bottom: 10px; }
        .title { font-size: 24px; font-weight: bold; margin: 0; }
        .info { font-size: 16px; margin-top: 5px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        th { border-bottom: 1px solid #000; padding: 4px 0; font-size: 18px; }
        td { text-align: left; vertical-align: top; padding: 4px 0; }
        .divider { border-top: 2px dashed #000; margin: 15px 0; }
        .total-section { font-size: 18px; }
        .total-row { display: flex; justify-content: space-between; margin-bottom: 6px; }
        .grand-total { font-size: 24px; font-weight: bold; border-top: 2px solid #000; padding-top: 10px; margin-top: 10px; }
        .footer { text-align: center; margin-top: 20px; font-size: 16px; border-top: 1px solid #000; padding-top: 10px; }
      </style>
    `;

    let content = "";

    if (type === "bill") {
      const items = data.cart.map(item => `
        <tr>
          <td style="width: 50%">${item.name}</td>
          <td style="width: 15%">${item.qty}</td>
          <td class="text-right" style="width: 35%">${(item.price * item.qty).toLocaleString()}</td>
        </tr>
      `).join("");

      content = `
        <div class="header text-center">
          <div class="title">${BRANCH_NAME}</div>
          <div class="info">วันที่: ${dayData?.date || ""} เวลา: ${data.time}</div>
        </div>
        <table>
          <thead>
            <tr><th class="text-left">รายการ</th><th>จน.</th><th class="text-right">รวม</th></tr>
          </thead>
          <tbody>${items}</tbody>
        </table>
        <div class="divider"></div>
        <div class="total-section">
          <div class="total-row grand-total">
            <span>รวมทั้งสิ้น</span>
            <span>${data.total.toLocaleString()}</span>
          </div>
          <div class="total-row">
            <span>การชำระเงิน:</span>
            <span>
              ${data.payment === "cash" ? "เงินสด" : ""}
              ${data.payment === "transfer" ? "PromptPay" : ""}
              ${data.payment === "lineman" ? "LINE MAN" : ""}
              ${data.payment === "grab" ? "Grab" : ""}
            </span>
          </div>
          ${data.payment === "cash" ? `
            <div class="total-row"><span>รับเงิน:</span><span>${data.cashReceived?.toLocaleString()}</span></div>
            <div class="total-row"><span>เงินทอน:</span><span>${data.change?.toLocaleString()}</span></div>
          ` : ""}
          ${data.payment === "lineman" && data.linemanOrderId ? `
            <div class="total-row"><span>เลข Order:</span><span>${data.linemanOrderId}</span></div>
          ` : ""}
          ${data.payment === "grab" && data.grabOrderId ? `
            <div class="total-row"><span>เลข Order:</span><span>${data.grabOrderId}</span></div>
          ` : ""}
        </div>
        <div class="footer">ขอบคุณที่ใช้บริการ</div>
      `;
    } else if (type === "closeDay") {
      content = `
        <div class="header text-center">
          <div class="title">${BRANCH_NAME}</div>
          <div class="info" style="font-size: 18px; font-weight: bold;">สรุปยอดปิดวัน${data.closeTime ? "" : " (ย้อนหลัง)"}</div>
          <div class="info">วันที่: ${data.date}</div>
        </div>
        <div class="total-section">
          <div class="total-row"><span>เวลาเปิด:</span><span>${data.openTime}</span></div>
          <div class="total-row"><span>เวลาปิด:</span><span>${data.closeTime || "-"}</span></div>
        </div>
        <div class="divider"></div>
        <div class="total-section">
          <div class="total-row"><span>เงินเปิดวัน:</span><span>${data.openCash.toLocaleString()}</span></div>
          <div class="total-row grand-total"><span>ยอดขายรวม:</span><span>${data.totalSales.toLocaleString()}</span></div>
          <div class="total-row"><span>- เงินสด:</span><span>${data.cashSales.toLocaleString()}</span></div>
          <div class="total-row"><span>- PromptPay:</span><span>${data.transferSales.toLocaleString()}</span></div>
          <div class="total-row"><span>- LINE MAN:</span><span>${data.linemanSales.toLocaleString()}</span></div>
          <div class="total-row"><span>- Grab:</span><span>${(data.grabSales || 0).toLocaleString()}</span></div>
          <div class="divider"></div>
          <div class="total-row grand-total"><span>เงินสดที่ต้องส่ง:</span><span>${(data.openCash + data.cashSales).toLocaleString()}</span></div>
        </div>
        <div class="footer">
          ผู้ส่งเงิน: _________________<br/><br/>
          ผู้รับเงิน: _________________
        </div>
      `;
    }

    return `<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${style}</head><body>${content}</body></html>`;
  };



  const printBill = (billData) => {
    setPrintData({ type: "bill", data: billData });
  };

  const printCloseDay = (closeDayData) => {
    setPrintData({ type: "closeDay", data: closeDayData });
  };

  /* ---------- Helpers ---------- */
  const total = cart.reduce((s, i) => s + getEffectivePrice(i, payment) * i.qty, 0);
  const change = payment === "cash" && cashReceived ? Number(cashReceived) - total : 0;

  const addItem = (item) => {
    setCart((prev) => {
      const found = prev.find((i) => i.id === item.id);
      if (found)
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        );
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const openEditBill = (source, billIndex, dayIndex, currentTotal) => {
    setEditingBill({ source, billIndex, dayIndex });
    setEditTotalValue(String(currentTotal));
  };

  const saveEditedBill = () => {
    const newTotal = Number(editTotalValue);
    if (isNaN(newTotal) || newTotal < 0) return;
    if (editingBill.source === "today") {
      const updatedBills = [...dayData.bills];
      updatedBills[editingBill.billIndex] = { ...updatedBills[editingBill.billIndex], total: newTotal };
      setDayData({ ...dayData, bills: updatedBills });
    } else {
      const updatedHistory = history.map((d, di) => {
        if (di !== editingBill.dayIndex) return d;
        const updatedBills = [...d.bills];
        updatedBills[editingBill.billIndex] = { ...updatedBills[editingBill.billIndex], total: newTotal };
        return { ...d, bills: updatedBills };
      });
      setHistory(updatedHistory);
    }
    setEditingBill(null);
  };

  const setItemDeliveryPrice = (itemId, value) => {
    const num = parseFloat(value);
    setCart((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? { ...i, deliveryPrice: value === "" || isNaN(num) ? undefined : num }
          : i
      )
    );
  };

  const removeItem = (itemId) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === itemId);
      if (item && item.qty > 1) {
        return prev.map((i) =>
          i.id === itemId ? { ...i, qty: i.qty - 1 } : i
        );
      }
      return prev.filter((i) => i.id !== itemId);
    });
  };

  const submitBill = () => {
    if (!cart.length) return;
    if (payment === "cash" && (!cashReceived || Number(cashReceived) < total)) {
      alert("กรุณาใส่จำนวนเงินที่รับมาให้ถูกต้อง");
      return;
    }

    const bill = {
      time: new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
      cart: cart.map(i => ({ ...i, price: getEffectivePrice(i, payment) })),
      total,
      payment,
      cashReceived: payment === "cash" ? Number(cashReceived) : null,
      change: payment === "cash" ? change : null,
      linemanOrderId: payment === "lineman" ? linemanOrderId.trim() : null,
      grabOrderId: payment === "grab" ? grabOrderId.trim() : null,
    };

    const updatedDayData = {
      ...dayData,
      bills: [...(dayData.bills || []), bill],
      closeTime: null, // Reset close time if exists
    };

    setDayData(updatedDayData);
    setLastBill(bill);
    setCart([]);
    setCashReceived("");
    setLinemanOrderId("");
    setGrabOrderId("");
    localStorage.removeItem("currentGrabOrderId");
    setPayment("cash");
    // Clear persisted cart/payment after successful bill
    localStorage.removeItem("currentCart");
    localStorage.removeItem("currentPayment");
    localStorage.removeItem("currentCashReceived");
    localStorage.removeItem("currentLinemanOrderId");

  };

  /* ---------- Pages ---------- */

  /* OPEN DAY */
  if (page === "open") {
    return (
      <div className="screen open-day">
        <div className="open-day-content">
          <h1 className="branch-title">{BRANCH_NAME}</h1>
          <h2>เปิดวัน</h2>
          <input
            type="number"
            className="open-cash-input"
            placeholder="ยอดเงินเปิดวัน"
            value={openCash}
            onChange={(e) => setOpenCash(e.target.value)}
          />
          <div className="open-day-actions">
            <button
              className="btn-primary btn-large"
              onClick={() => {
                if (!openCash || Number(openCash) < 0) {
                  alert("กรุณาใส่ยอดเงินเปิดวัน");
                  return;
                }
                const now = new Date();
                setDayData({
                  date: now.toLocaleDateString("th-TH"),
                  openTime: now.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
                  openCash: Number(openCash),
                  bills: [],
                  closeTime: null,
                });
                setOpenCash("");
                setPage("sell");
              }}
            >
              ✅ เปิดวัน
            </button>
            <button
              className="btn-secondary btn-large"
              onClick={() => setPage("report")}
            >
              📊 ดูยอดขายย้อนหลัง
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* SELL */
  if (page === "sell") {
    if (!dayData) {
      setPage("open");
      return null;
    }

    return (
      <>
        <div className="screen sell-page">
          <header className="sell-header">
            <div className="header-left">
              <b className="branch-name">{BRANCH_NAME}</b>
              <span className="date-info">{dayData.date}</span>
            </div>
            <div className="header-actions">
              <button className="btn-header" onClick={() => setPage("today")}>
                รายการวันนี้
              </button>
              <button className="btn-header" onClick={() => setPage("close")}>
                ปิดวัน
              </button>
              <button className="btn-header" onClick={() => setPage("report")}>
                รายงาน
              </button>
            </div>
          </header>

          <div className="sell-main">
            {/* Left: Menu */}
            <div className="menu-section">
              <div className="menu-categories">
                {menu.map((c) => (
                  <div key={c.category} className="category-group">
                    <h3 className="category-title">{c.category}</h3>
                    <div className="menu-grid">
                      {c.items.map((i) => (
                        <button
                          key={i.id}
                          className="menu-item-btn"
                          onClick={() => addItem(i)}
                        >
                          <div className="menu-item-name">{i.name}</div>
                          <div className="menu-item-price">{getEffectivePrice(i, payment)} บาท</div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Cart & Summary */}
            <div className="cart-section">
              <div className="cart-container">
                <h3 className="cart-title">ตะกร้า</h3>
                <div className="cart-items">
                  {cart.length === 0 ? (
                    <div className="cart-empty">ไม่มีรายการ</div>
                  ) : (
                    cart.map((i) => (
                      <div key={i.id} className="cart-item">
                        <div className="cart-item-info">
                          <div className="cart-item-name">{i.name}</div>
                          <div className="cart-item-details">
                            {(payment === "grab" || payment === "lineman") ? (
                              <>
                                <input
                                  type="number"
                                  inputMode="numeric"
                                  style={{ width: "60px", fontSize: "14px", padding: "2px 4px", textAlign: "right", border: "1px solid #aaa", borderRadius: "4px", marginRight: "2px" }}
                                  value={i.deliveryPrice !== undefined ? i.deliveryPrice : getEffectivePrice(i, payment)}
                                  onChange={(e) => setItemDeliveryPrice(i.id, e.target.value)}
                                />
                                {" บาท × "}{i.qty}{" = "}{getEffectivePrice(i, payment) * i.qty}{" บาท"}
                              </>
                            ) : (
                              `${getEffectivePrice(i, payment)} บาท × ${i.qty} = ${getEffectivePrice(i, payment) * i.qty} บาท`
                            )}
                          </div>
                        </div>
                        <div className="cart-item-actions">
                          <button
                            className="btn-qty"
                            onClick={() => removeItem(i.id)}
                          >
                            −
                          </button>
                          <span className="cart-qty">{i.qty}</span>
                          <button
                            className="btn-qty"
                            onClick={() => addItem(i)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="cart-summary">
                  <div className="summary-row">
                    <span>รวมทั้งหมด:</span>
                    <span className="summary-total">{total.toLocaleString()} บาท</span>
                  </div>

                  <div className="payment-methods">
                    <div className="payment-title">ช่องทางการชำระเงิน:</div>
                    <div className="payment-buttons">
                      <button
                        className={`payment-btn ${payment === "cash" ? "active" : ""}`}
                        onClick={() => {
                          setPayment("cash");
                          setCashReceived("");
                        }}
                      >
                        💵 เงินสด
                      </button>
                      <button
                        className={`payment-btn ${payment === "transfer" ? "active" : ""}`}
                        onClick={() => {
                          setPayment("transfer");
                          setCashReceived("");
                        }}
                      >
                        📱 PromptPay
                      </button>
                      <button
                        className={`payment-btn ${payment === "lineman" ? "active" : ""}`}
                        onClick={() => {
                          setPayment("lineman");
                          setCashReceived("");
                        }}
                      >
                        🛵 LINE MAN
                      </button>
                      <button
                        className={`payment-btn grab-btn ${payment === "grab" ? "active" : ""}`}
                        onClick={() => {
                          setPayment("grab");
                          setCashReceived("");
                        }}
                      >
                        🟢 Grab
                      </button>
                    </div>
                  </div>

                  {/* สรุปรายการตามช่องทางชำระเงิน */}
                  <div className="payment-summary">
                    {payment === "cash" && (
                      <div className="payment-summary-content">
                        <div className="summary-info-row">
                          <span>ยอดรวม:</span>
                          <span className="summary-value">{total.toLocaleString()} บาท</span>
                        </div>
                        {cashReceived && (
                          <>
                            <div className="summary-info-row">
                              <span>รับเงินมา:</span>
                              <span className="summary-value">{Number(cashReceived).toLocaleString()} บาท</span>
                            </div>
                            {Number(cashReceived) >= total && (
                              <div className="summary-info-row highlight">
                                <span>เงินทอน:</span>
                                <span className="summary-value change-amount">{change.toLocaleString()} บาท</span>
                              </div>
                            )}
                            {Number(cashReceived) < total && (
                              <div className="summary-info-row error">
                                <span>เงินไม่พอ:</span>
                                <span className="summary-value">{(total - Number(cashReceived)).toLocaleString()} บาท</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                    {payment === "transfer" && (
                      <div className="payment-summary-content">
                        <div className="summary-info-row">
                          <span>ยอดรวม (PromptPay):</span>
                          <span className="summary-value">{total.toLocaleString()} บาท</span>
                        </div>
                        <div className="payment-note">📱 PromptPay</div>
                      </div>
                    )}
                    {payment === "lineman" && (
                      <div className="payment-summary-content">
                        <div className="summary-info-row">
                          <span>ยอดรวม (LINE MAN):</span>
                          <span className="summary-value">{total.toLocaleString()} บาท</span>
                        </div>
                        <div className="lineman-order-row">
                          <span className="lineman-order-label">🛵 เลข Order:</span>
                          <input
                            type="text"
                            className="lineman-order-input"
                            placeholder="กรอกเลข order LINE MAN"
                            value={linemanOrderId}
                            onChange={(e) => setLinemanOrderId(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                    {payment === "grab" && (
                      <div className="payment-summary-content">
                        <div className="summary-info-row">
                          <span>ยอดรวม (Grab):</span>
                          <span className="summary-value">{total.toLocaleString()} บาท</span>
                        </div>
                        <div className="lineman-order-row">
                          <span className="lineman-order-label">🟢 เลข Order:</span>
                          <input
                            type="text"
                            className="grab-order-input"
                            placeholder="กรอกเลข order Grab"
                            value={grabOrderId}
                            onChange={(e) => setGrabOrderId(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {payment === "cash" && (
                    <div className="cash-input-section">
                      <input
                        type="number"
                        className="cash-input"
                        placeholder="รับเงินมา"
                        value={cashReceived}
                        onChange={(e) => setCashReceived(e.target.value)}
                      />
                    </div>
                  )}

                  <button
                    className="btn-submit-bill"
                    onClick={submitBill}
                    disabled={cart.length === 0 || (payment === "cash" && (!cashReceived || Number(cashReceived) < total))}
                  >
                    🧾 ปิดบิล
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bill Confirmation Popup */}
        {lastBill && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", width: "100%", maxWidth: "320px", textAlign: "center" }}>
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>✅</div>
              <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "4px" }}>ปิดบิลสำเร็จ</div>
              <div style={{ fontSize: "28px", fontWeight: "bold", color: "#2d7a3a", margin: "12px 0" }}>
                {lastBill.total.toLocaleString()} บาท
              </div>
              <div style={{ fontSize: "14px", color: "#666", marginBottom: "16px" }}>
                {lastBill.payment === "cash" && `💵 เงินสด • ทอน ${lastBill.change?.toLocaleString()} บาท`}
                {lastBill.payment === "transfer" && "📱 PromptPay"}
                {lastBill.payment === "lineman" && `🛵 LINE MAN${lastBill.linemanOrderId ? ` • ${lastBill.linemanOrderId}` : ""}`}
                {lastBill.payment === "grab" && `🟢 Grab${lastBill.grabOrderId ? ` • ${lastBill.grabOrderId}` : ""}`}
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  style={{ flex: 1, padding: "12px", fontSize: "16px", background: "#6c757d", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}
                  onClick={() => setLastBill(null)}
                >
                  ปิด
                </button>
                <button
                  style={{ flex: 1, padding: "12px", fontSize: "16px", background: "#2d7a3a", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}
                  onClick={() => { printBill(lastBill); setLastBill(null); }}
                >
                  🖨️ พิมพ์
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Print Area - Hidden on Screen */}
        {printData && (
          <div className="print-area">
            {printData.type === "bill" && (
              <>
                <div className="print-header">
                  <h1 className="print-title">{BRANCH_NAME}</h1>
                  <div className="print-info">วันที่: {dayData?.date} เวลา: {printData.data.time}</div>
                </div>
                <table className="print-table">
                  <thead>
                    <tr>
                      <th style={{ width: '50%' }}>รายการ</th>
                      <th style={{ width: '20%' }}>จน.</th>
                      <th style={{ width: '30%' }} className="text-right">รวม</th>
                    </tr>
                  </thead>
                  <tbody>
                    {printData.data.cart.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.name}</td>
                        <td>{item.qty}</td>
                        <td className="text-right">{(item.price * item.qty).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="print-divider"></div>

                <div className="print-total-section">
                  <div className="print-row total">
                    <span>รวมทั้งสิ้น</span>
                    <span>{printData.data.total.toLocaleString()}</span>
                  </div>

                  <div className="print-row">
                    <span>การชำระเงิน:</span>
                    <span>
                      {printData.data.payment === "cash" && "เงินสด"}
                      {printData.data.payment === "transfer" && "PromptPay"}
                      {printData.data.payment === "lineman" && "LINE MAN"}
                    </span>
                  </div>

                  {printData.data.payment === "cash" && (
                    <>
                      <div className="print-row">
                        <span>รับเงิน:</span>
                        <span>{printData.data.cashReceived?.toLocaleString()}</span>
                      </div>
                      <div className="print-row">
                        <span>เงินทอน:</span>
                        <span>{printData.data.change?.toLocaleString()}</span>
                      </div>
                    </>
                  )}
                  {printData.data.payment === "lineman" && printData.data.linemanOrderId && (
                    <div className="print-row">
                      <span>เลข Order:</span>
                      <span>{printData.data.linemanOrderId}</span>
                    </div>
                  )}
                </div>

                <div className="print-footer">
                  ขอบคุณที่ใช้บริการ
                </div>
              </>
            )}
          </div>
        )}
      </>
    );
  }

  /* TODAY ORDERS */
  if (page === "today") {
    if (!dayData) {
      setPage("open");
      return null;
    }

    const bills = dayData.bills || [];
    const totalSales = bills.reduce((s, b) => s + b.total, 0);
    const cashSales = bills.filter((b) => b.payment === "cash").reduce((s, b) => s + b.total, 0);
    const transferSales = bills.filter((b) => b.payment === "transfer").reduce((s, b) => s + b.total, 0);
    const linemanSales = bills.filter((b) => b.payment === "lineman").reduce((s, b) => s + b.total, 0);
    const grabSales = bills.filter((b) => b.payment === "grab").reduce((s, b) => s + b.total, 0);

    return (
      <>
      <div className="screen report-page">
        <div className="report-content">
          <div className="report-header">
            <h2>รายการวันนี้ — {dayData.date}</h2>
            <button className="btn-back" onClick={() => setPage("sell")}>
              ← กลับขาย
            </button>
          </div>

          <div className="sales-summary" style={{ marginBottom: "16px" }}>
            <div className="summary-box">
              <div className="summary-item">
                <span>บิลทั้งหมด:</span>
                <span className="amount">{bills.length} บิล</span>
              </div>
              <div className="summary-item">
                <span>ยอดขายรวม:</span>
                <span className="amount">{totalSales.toLocaleString()} บาท</span>
              </div>
              <div className="summary-item">
                <span>💵 เงินสด:</span>
                <span className="amount">{cashSales.toLocaleString()} บาท</span>
              </div>
              <div className="summary-item">
                <span>📱 PromptPay:</span>
                <span className="amount">{transferSales.toLocaleString()} บาท</span>
              </div>
              <div className="summary-item">
                <span>🛵 LINE MAN:</span>
                <span className="amount">{linemanSales.toLocaleString()} บาท</span>
              </div>
              <div className="summary-item">
                <span>🟢 Grab:</span>
                <span className="amount">{grabSales.toLocaleString()} บาท</span>
              </div>
            </div>
          </div>

          {bills.length === 0 ? (
            <div className="report-empty">ยังไม่มีบิลวันนี้</div>
          ) : (
            <div className="report-list">
              {[...bills].reverse().map((b, i) => {
                const realIndex = bills.length - 1 - i;
                return (
                <div key={i} className="report-bill">
                  <div className="bill-header">
                    <span className="bill-time">{b.time}</span>
                    <span className={`bill-payment payment-${b.payment}`}>
                      {b.payment === "cash" && "💵 เงินสด"}
                      {b.payment === "transfer" && "📱 PromptPay"}
                      {b.payment === "lineman" && "🛵 LINE MAN"}
                      {b.payment === "grab" && "🟢 Grab"}
                    </span>
                    <span className="bill-total">{b.total.toLocaleString()} บาท</span>
                    {(b.payment === "grab" || b.payment === "lineman") && (
                      <button
                        style={{ marginLeft: "8px", padding: "2px 6px", fontSize: "12px", background: "#ffc107", color: "#000", border: "none", borderRadius: "4px", cursor: "pointer" }}
                        onClick={() => openEditBill("today", realIndex, null, b.total)}
                      >
                        แก้
                      </button>
                    )}
                    <button
                      style={{ marginLeft: "4px", padding: "2px 6px", fontSize: "12px", background: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                      onClick={() => printBill(b)}
                    >
                      🖨️
                    </button>
                  </div>
                  <div className="bill-items">
                    {b.cart.map((c, k) => (
                      <div key={k} className="bill-item">
                        {c.name} × {c.qty} = {(c.price * c.qty).toLocaleString()} บาท
                      </div>
                    ))}
                  </div>
                  {b.payment === "lineman" && b.linemanOrderId && (
                    <div className="bill-cash-info">🛵 Order: {b.linemanOrderId}</div>
                  )}
                  {b.payment === "grab" && b.grabOrderId && (
                    <div className="bill-cash-info">🟢 Order: {b.grabOrderId}</div>
                  )}
                </div>
              );
              })}
            </div>
          )}
        </div>
      </div>
      {editingBill && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", width: "100%", maxWidth: "300px" }}>
            <div style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "16px" }}>แก้ยอดรวมบิล</div>
            <input
              type="number"
              inputMode="numeric"
              style={{ width: "100%", fontSize: "24px", padding: "10px", textAlign: "center", border: "2px solid #2d7a3a", borderRadius: "8px", boxSizing: "border-box", marginBottom: "16px" }}
              value={editTotalValue}
              onChange={(e) => setEditTotalValue(e.target.value)}
              autoFocus
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <button style={{ flex: 1, padding: "12px", fontSize: "16px", background: "#6c757d", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }} onClick={() => setEditingBill(null)}>ยกเลิก</button>
              <button style={{ flex: 1, padding: "12px", fontSize: "16px", background: "#2d7a3a", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }} onClick={saveEditedBill}>บันทึก</button>
            </div>
          </div>
        </div>
      )}
      </>
    );
  }

  /* CLOSE DAY */
  if (page === "close") {
    if (!dayData) {
      setPage("open");
      return null;
    }

    const totalSales = dayData.bills.reduce((s, b) => s + b.total, 0);
    const cashSales = dayData.bills
      .filter((b) => b.payment === "cash")
      .reduce((s, b) => s + b.total, 0);
    const transferSales = dayData.bills
      .filter((b) => b.payment === "transfer")
      .reduce((s, b) => s + b.total, 0);
    const linemanSales = dayData.bills
      .filter((b) => b.payment === "lineman")
      .reduce((s, b) => s + b.total, 0);

    return (
      <>
        <div className="screen close-day">
          <div className="close-day-content">
            <h2>สรุปปิดวัน</h2>
            <div className="close-info">
              <div className="info-row">
                <span>ชื่อสาขา:</span>
                <span>{BRANCH_NAME}</span>
              </div>
              <div className="info-row">
                <span>วันที่:</span>
                <span>{dayData.date}</span>
              </div>
              <div className="info-row">
                <span>เวลาเปิดวัน:</span>
                <span>{dayData.openTime || "-"}</span>
              </div>
              <div className="info-row">
                <span>เวลาปิดวัน:</span>
                <span>{dayData.closeTime || "ยังไม่ปิด"}</span>
              </div>
              <div className="info-row highlight">
                <span>เงินสดเปิดวัน:</span>
                <span>{dayData.openCash.toLocaleString()} บาท</span>
              </div>
            </div>

            <div className="sales-summary">
              <h3>สรุปยอดขาย</h3>
              <div className="summary-box">
                <div className="summary-item">
                  <span>ยอดขายทั้งหมด:</span>
                  <span className="amount">{totalSales.toLocaleString()} บาท</span>
                </div>
                <div className="summary-item">
                  <span>💵 เงินสด:</span>
                  <span className="amount">{cashSales.toLocaleString()} บาท</span>
                </div>
                <div className="summary-item">
                  <span>📱 PromptPay:</span>
                  <span className="amount">{transferSales.toLocaleString()} บาท</span>
                </div>
                <div className="summary-item">
                  <span>🛵 LINE MAN:</span>
                  <span className="amount">{linemanSales.toLocaleString()} บาท</span>
                </div>
                <div className="summary-item highlight">
                  <span>เงินสดที่ควรมี:</span>
                  <span className="amount">{(dayData.openCash + cashSales).toLocaleString()} บาท</span>
                </div>
              </div>
            </div>

            <div className="close-day-extra">
              <h3>ข้อมูลเพิ่มเติม</h3>
              <div className="extra-field">
                <label>ยอด LINE MAN รวม (จาก LINE MAN Merchant)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={linemanInput}
                  onChange={(e) => setLinemanInput(e.target.value)}
                  className="extra-input"
                />
              </div>
              <div className="extra-field">
                <label>ยอด Grab รวม (จาก Grab Merchant)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={grabInput}
                  onChange={(e) => setGrabInput(e.target.value)}
                  className="extra-input"
                />
              </div>
              <div className="extra-field">
                <label>ไก่ต้ม (ตัว)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={kaiTon}
                  onChange={(e) => setKaiTon(e.target.value)}
                  className="extra-input"
                />
              </div>
              <div className="extra-field">
                <label>น่องสะโพก (กก.)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={nongSaPok}
                  onChange={(e) => setNongSaPok(e.target.value)}
                  className="extra-input"
                />
              </div>
            </div>

            <div className="close-day-actions">
              <button
                className="btn-secondary btn-large"
                onClick={() => setPage("sell")}
              >
                ❌ กลับไปขายต่อ
              </button>
              <button
                className="btn-primary btn-large"
                onClick={() => {
                  const closeTime = new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
                  const linemanTotal = Number(linemanInput) || 0;
                  const grabTotal = Number(grabInput) || 0;
                  const updatedDayData = {
                    ...dayData,
                    closeTime,
                    linemanTotal,
                    grabTotal,
                    kaiTon: Number(kaiTon) || 0,
                    nongSaPok: Number(nongSaPok) || 0,
                  };

                  // Save history immediately
                  const newHistory = [...history, updatedDayData];
                  setHistory(newHistory);
                  localStorage.setItem("history", JSON.stringify(newHistory));

                  setDayData(null);
                  localStorage.removeItem("currentDay");
                  setLinemanInput("");
                  setGrabInput("");
                  setKaiTon("");
                  setNongSaPok("");

                  // Save to Google Sheets
                  fetch("https://bbc-ordering-system.vercel.app/api/gateway-pos/close-day", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      date: updatedDayData.date,
                      openTime: updatedDayData.openTime,
                      closeTime,
                      openCash: updatedDayData.openCash,
                      bills: updatedDayData.bills,
                      linemanTotal,
                      grabTotal,
                      kaiTon: updatedDayData.kaiTon,
                      nongSaPok: updatedDayData.nongSaPok,
                    }),
                  }).catch((err) => console.error("close-day sheet error:", err));

                  // Print Close Day Summary
                  printCloseDay({ ...updatedDayData, totalSales, cashSales, transferSales, linemanSales: linemanTotal, grabSales: grabTotal });

                  setTimeout(() => setPage("open"), 1000);
                }}
              >
                ✅ ยืนยันปิดวัน
              </button>
            </div>
          </div>
        </div>

        {/* Print Area - Close Day */}
        {printData && printData.type === "closeDay" && (
          <div className="print-area">
            <div className="print-header">
              <h1 className="print-title">{BRANCH_NAME}</h1>
              <div className="print-title" style={{ fontSize: '14px', marginTop: '10px' }}>สรุปยอดปิดวัน</div>
              <div className="print-info">วันที่: {printData.data.date}</div>
            </div>

            <div className="print-table">
              <div className="print-row">
                <span>เวลาเปิด:</span>
                <span>{printData.data.openTime}</span>
              </div>
              <div className="print-row">
                <span>เวลาปิด:</span>
                <span>{printData.data.closeTime}</span>
              </div>
            </div>

            <div className="print-divider"></div>

            <div className="print-total-section">
              <div className="print-row">
                <span>เงินเปิดวัน:</span>
                <span>{printData.data.openCash.toLocaleString()}</span>
              </div>
              <div className="print-row total">
                <span>ยอดขายรวม:</span>
                <span>{printData.data.totalSales.toLocaleString()}</span>
              </div>
              <div className="print-row">
                <span>- เงินสด:</span>
                <span>{printData.data.cashSales.toLocaleString()}</span>
              </div>
              <div className="print-row">
                <span>- PromptPay:</span>
                <span>{printData.data.transferSales.toLocaleString()}</span>
              </div>
              <div className="print-row">
                <span>- LINE MAN:</span>
                <span>{printData.data.linemanSales.toLocaleString()}</span>
              </div>

              <div className="print-divider"></div>

              <div className="print-row total" style={{ fontSize: '18px' }}>
                <span>เงินสดที่ต้องส่ง:</span>
                <span>{(printData.data.openCash + printData.data.cashSales).toLocaleString()}</span>
              </div>
            </div>

            <div className="print-footer">
              ผู้ส่งเงิน: _________________<br /><br />
              ผู้รับเงิน: _________________
            </div>
          </div>
        )}
      </>
    );
  }

  /* REPORT */
  if (page === "report") {
    const getBackPage = () => {
      if (dayData) return "sell";
      return "open";
    };

    return (
      <>
        <div className="screen report-page">
          <div className="report-content">
            <div className="report-header">
              <h2>รายงานย้อนหลัง</h2>
              <button className="btn-back" onClick={() => setPage(getBackPage())}>
                ← กลับ
              </button>
            </div>

            {history.length === 0 ? (
              <div className="report-empty">ยังไม่มีข้อมูลย้อนหลัง</div>
            ) : (
              <div className="report-list">
                {history.map((d, i) => {
                  const totalSales = d.bills.reduce((s, b) => s + b.total, 0);
                  const cashSales = d.bills
                    .filter((b) => b.payment === "cash")
                    .reduce((s, b) => s + b.total, 0);
                  const transferSales = d.bills
                    .filter((b) => b.payment === "transfer")
                    .reduce((s, b) => s + b.total, 0);
                  const linemanSales = d.bills
                    .filter((b) => b.payment === "lineman")
                    .reduce((s, b) => s + b.total, 0);

                  return (
                    <details key={i} className="report-day">
                      <summary className="report-summary">
                        <div className="report-summary-left">
                          <span className="report-date">{d.date}</span>
                          <span className="report-time">
                            {d.openTime} - {d.closeTime || "ยังไม่ปิด"}
                          </span>
                        </div>
                        <div className="report-summary-right">
                          <span className="report-total">{totalSales.toLocaleString()} บาท</span>
                          {/* Print Button Detail */}
                          <button
                            style={{
                              marginLeft: '10px',
                              padding: '4px 8px',
                              fontSize: '14px',
                              background: '#17a2b8',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              printCloseDay({ ...d, totalSales, cashSales, transferSales, linemanSales });
                            }}
                          >
                            🖨️ พิมพ์
                          </button>
                        </div>
                      </summary>
                      <div className="report-details">
                        <div className="report-day-summary">
                          <div className="report-summary-row">
                            <span>เงินเปิดวัน:</span>
                            <span>{d.openCash.toLocaleString()} บาท</span>
                          </div>
                          <div className="report-summary-row">
                            <span>ยอดขายรวม:</span>
                            <span>{totalSales.toLocaleString()} บาท</span>
                          </div>
                          <div className="report-summary-row">
                            <span>💵 เงินสด:</span>
                            <span>{cashSales.toLocaleString()} บาท</span>
                          </div>
                          <div className="report-summary-row">
                            <span>📱 PromptPay:</span>
                            <span>{transferSales.toLocaleString()} บาท</span>
                          </div>
                          <div className="report-summary-row">
                            <span>🛵 LINE MAN:</span>
                            <span>{linemanSales.toLocaleString()} บาท</span>
                          </div>
                        </div>
                        <div className="report-bills">
                          <h4>รายการบิลทั้งหมด ({d.bills.length} บิล)</h4>
                          {d.bills.map((b, j) => (
                            <div key={j} className="report-bill">
                              <div className="bill-header">
                                <span className="bill-time">{b.time}</span>
                                <span className={`bill-payment payment-${b.payment}`}>
                                  {b.payment === "cash" && "💵 เงินสด"}
                                  {b.payment === "transfer" && "📱 PromptPay"}
                                  {b.payment === "lineman" && "🛵 LINE MAN"}
                                  {b.payment === "grab" && "🟢 Grab"}
                                </span>
                                <span className="bill-total">{b.total.toLocaleString()} บาท</span>
                                {(b.payment === "grab" || b.payment === "lineman") && <button
                                  style={{ marginLeft: '8px', padding: '2px 6px', fontSize: '12px', background: '#ffc107', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                  onClick={() => openEditBill("history", j, i, b.total)}
                                >
                                  แก้
                                </button>}
                                <button
                                  style={{ marginLeft: '4px', padding: '2px 6px', fontSize: '12px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                  onClick={() => printBill(b)}
                                >
                                  🖨️
                                </button>
                              </div>
                              <div className="bill-items">
                                {b.cart.map((c, k) => (
                                  <div key={k} className="bill-item">
                                    {c.name} × {c.qty} = {(c.price * c.qty).toLocaleString()} บาท
                                  </div>
                                ))}
                              </div>
                              {b.payment === "cash" && b.cashReceived && (
                                <div className="bill-cash-info">
                                  รับมา: {b.cashReceived.toLocaleString()} บาท |
                                  ทอน: {b.change.toLocaleString()} บาท
                                </div>
                              )}
                              {b.payment === "lineman" && b.linemanOrderId && (
                                <div className="bill-cash-info">
                                  🛵 Order: {b.linemanOrderId}
                                </div>
                              )}
                              {b.payment === "grab" && b.grabOrderId && (
                                <div className="bill-cash-info">
                                  🟢 Order: {b.grabOrderId}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </details>
                  );
                })}
              </div>
            )}

          </div>
        </div>
        {/* Edit Bill Total Modal */}
        {editingBill && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", width: "100%", maxWidth: "300px" }}>
              <div style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "16px" }}>แก้ยอดรวมบิล</div>
              <input
                type="number"
                inputMode="numeric"
                style={{ width: "100%", fontSize: "24px", padding: "10px", textAlign: "center", border: "2px solid #2d7a3a", borderRadius: "8px", boxSizing: "border-box", marginBottom: "16px" }}
                value={editTotalValue}
                onChange={(e) => setEditTotalValue(e.target.value)}
                autoFocus
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  style={{ flex: 1, padding: "12px", fontSize: "16px", background: "#6c757d", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}
                  onClick={() => setEditingBill(null)}
                >
                  ยกเลิก
                </button>
                <button
                  style={{ flex: 1, padding: "12px", fontSize: "16px", background: "#2d7a3a", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}
                  onClick={saveEditedBill}
                >
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Print Area - Reused for history reports */}
        {printData && printData.type === "closeDay" && (
          <div className="print-area">
            <div className="print-header">
              <h1 className="print-title">{BRANCH_NAME}</h1>
              <div className="print-title" style={{ fontSize: '14px', marginTop: '10px' }}>สรุปยอดปิดวัน (ย้อนหลัง)</div>
              <div className="print-info">วันที่: {printData.data.date}</div>
            </div>

            <div className="print-table">
              <div className="print-row">
                <span>เวลาเปิด:</span>
                <span>{printData.data.openTime}</span>
              </div>
              <div className="print-row">
                <span>เวลาปิด:</span>
                <span>{printData.data.closeTime || "-"}</span>
              </div>
            </div>

            <div className="print-divider"></div>

            <div className="print-total-section">
              <div className="print-row">
                <span>เงินเปิดวัน:</span>
                <span>{printData.data.openCash.toLocaleString()}</span>
              </div>
              <div className="print-row total">
                <span>ยอดขายรวม:</span>
                <span>{printData.data.totalSales.toLocaleString()}</span>
              </div>
              <div className="print-row">
                <span>- เงินสด:</span>
                <span>{printData.data.cashSales.toLocaleString()}</span>
              </div>
              <div className="print-row">
                <span>- PromptPay:</span>
                <span>{printData.data.transferSales.toLocaleString()}</span>
              </div>
              <div className="print-row">
                <span>- LINE MAN:</span>
                <span>{printData.data.linemanSales.toLocaleString()}</span>
              </div>

              <div className="print-divider"></div>

              <div className="print-row total" style={{ fontSize: '18px' }}>
                <span>เงินสดที่ต้องส่ง:</span>
                <span>{(printData.data.openCash + printData.data.cashSales).toLocaleString()}</span>
              </div>
            </div>

            <div className="print-footer">
              (เอกสารสำเนา)
            </div>
          </div>
        )}
      </>
    );
  }
}
