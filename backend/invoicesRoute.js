import express from 'express';
import pool from './db.js';

const router = express.Router();

// 1. API LẤY DANH SÁCH HÓA ĐƠN (GET /api/invoices)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM invoices ORDER BY created_date DESC');
    
    // Định dạng kiểu dữ liệu số từ DB sang Front-end để không bị báo đỏ kiểu dữ liệu
    const formattedInvoices = result.rows.map(row => ({
      id: row.id,
      code: row.code,
      bookingId: row.booking_id,
      createdDate: row.created_date,
      createdBy: row.created_by,
      roomCharge: Number(row.room_charge),
      servicesCharge: Number(row.services_charge),
      surcharge: Number(row.surcharge),
      discount: Number(row.discount),
      totalAmount: Number(row.total_amount),
      paymentMethod: row.payment_method,
      status: row.status,
      cancelReason: row.cancel_reason,
      note: row.note
    }));
    
    res.json(formattedInvoices);
  } catch (error) {
    console.error('Lỗi lấy danh sách hóa đơn:', error);
    res.status(500).json({ error: 'Không thể tải danh sách hóa đơn.' });
  }
});

// 2. API TẠO HÓA ĐƠN THANH TOÁN CHECK-OUT (POST /api/invoices)
router.post('/', async (req, res) => {
  const { 
    id, code, bookingId, roomCharge, servicesCharge, 
    surcharge, discount, totalAmount, paymentMethod, status, note, createdBy 
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO invoices (id, code, booking_id, room_charge, services_charge, surcharge, discount, total_amount, payment_method, status, note, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [id, code, bookingId, roomCharge, servicesCharge, surcharge, discount, totalAmount, paymentMethod, status, note, createdBy || 'Trần Nguyễn Khánh Duy']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Lỗi tạo hóa đơn mới:', error);
    res.status(500).json({ error: 'Không thể tạo hóa đơn thanh toán mới.' });
  }
});

export default router;