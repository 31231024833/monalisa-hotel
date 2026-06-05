import express from 'express';
import pool from './db.js';

const router = express.Router();

// 1. API LẤY TOÀN BỘ PHÒNG (GET /api/rooms)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rooms ORDER BY number ASC');
    
    const formattedRooms = result.rows.map(row => ({
      id: row.id,
      number: row.number,
      name: row.name || `Phòng ${row.number}`, // Dự phòng nếu tên rỗng
      type: row.type,
      floor: row.floor,
      price: Number(row.price),
      capacity: row.capacity,
      status: row.status,
      description: row.description
    }));
    
    res.json(formattedRooms);
  } catch (error) {
    console.error('Lỗi lấy phòng:', error);
    res.status(500).json({ error: 'Không thể tải danh sách phòng.' });
  }
});

// 2. API THÊM PHÒNG MỚI (POST /api/rooms) - Đã cập nhật nạp trường NAME
router.post('/', async (req, res) => {
  const { id, number, name, type, floor, price, capacity, status, description } = req.body;

  try {
    // Chèn dữ liệu có cấu trúc thêm trường name mới vào SQL
    const result = await pool.query(
      `INSERT INTO rooms (id, number, name, type, floor, price, capacity, status, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [id, number, name, type, floor, price, capacity, status || 'Trống', description]
    );
    
    const row = result.rows[0];
    res.status(201).json({
      id: row.id,
      number: row.number,
      name: row.name,
      type: row.type,
      floor: row.floor,
      price: Number(row.price),
      capacity: row.capacity,
      status: row.status,
      description: row.description
    });
  } catch (error) {
    console.error('Lỗi thêm phòng:', error);
    res.status(500).json({ error: 'Không thể thêm phòng mới vào Database.' });
  }
});

export default router;