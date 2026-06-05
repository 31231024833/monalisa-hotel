import express from 'express';
import pool from './db.js';

const router = express.Router();

// 1. API LẤY TOÀN BỘ ĐƠN ĐẶT PHÒNG (GET /api/bookings)
router.get('/', async (req, res) => {
  try {
    // Truy vấn kết hợp JOIN để lấy tên khách hàng và số phòng trực tiếp từ Database
    const queryText = `
      SELECT b.id, b.code, b.room_id, b.guest_id, b.status,
             to_char(b.check_in_date, 'YYYY-MM-DD') as check_in_date,
             to_char(b.check_out_date, 'YYYY-MM-DD') as check_out_date,
             u.full_name as guest_name, u.phone,
             r.number as room_number, r.type as room_type
      FROM bookings b
      LEFT JOIN users u ON b.guest_id = u.id
      LEFT JOIN rooms r ON b.room_id = r.id
      ORDER BY b.check_in_date DESC
    `;
    const result = await pool.query(queryText);
    
    // Định dạng dữ liệu trả về giống hệt cấu trúc state cũ để Front-end không bị lỗi
    const formattedBookings = result.rows.map(row => ({
      id: row.id,
      code: row.code,
      roomId: row.room_id,
      guestId: row.guest_id,
      checkIn: row.check_in_date,
      checkOut: row.check_out_date,
      status: row.status,
      guestName: row.guest_name,
      phone: row.phone,
      roomNumber: row.room_number,
      roomType: row.room_type,
      servicesUsed: [] // Tạm thời để mảng rỗng cho đơn giản
    }));

    res.json(formattedBookings);
  } catch (error) {
    console.error('Lỗi lấy đơn đặt phòng:', error);
    res.status(500).json({ error: 'Không thể tải danh sách đơn đặt phòng.' });
  }
});

// 2. API KHÁCH ĐẶT PHÒNG HOẶC LỄ TÂN CHECK-IN (POST /api/bookings)
router.post('/', async (req, res) => {
  const { id, code, roomId, guestId, checkInDate, checkOutDate, status, guestName, phone } = req.body;

  try {
    // Thực hiện chuỗi giao dịch (Transaction) an toàn:
    // Bước A: Kiểm tra xem khách hàng đã tồn tại trong bảng users chưa, nếu chưa thì tự tạo mới
    const checkUser = await pool.query('SELECT * FROM users WHERE id = $1', [guestId]);
    if (checkUser.rows.length === 0) {
      const tempEmail = `${guestId}@monalisa.com`;
      await pool.query(
        `INSERT INTO users (id, full_name, phone, email, password, role) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [guestId, guestName || 'Khách vãng lai', phone || 'Chưa cập nhật', tempEmail, '12345678', 'khach_hang']
      );
    }

    // Bước B: Tạo bản ghi đặt phòng mới
    const newBooking = await pool.query(
      `INSERT INTO bookings (id, code, room_id, guest_id, check_in_date, check_out_date, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [id, code, roomId, guestId, checkInDate, checkOutDate, status || 'Đang lưu trú']
    );

    // Bước C: Tự động cập nhật trạng thái phòng vừa đặt thành "Đang sử dụng"
    await pool.query("UPDATE rooms SET status = 'Đang sử dụng' WHERE id = $1", [roomId]);

    res.status(201).json(newBooking.rows[0]);
  } catch (error) {
    console.error('Lỗi tạo đơn đặt phòng:', error);
    res.status(500).json({ error: 'Không thể lưu đơn đặt phòng mới.' });
  }
});

export default router;