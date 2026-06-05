import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from './db.js';

const router = express.Router();

// =========================================================
// 1. API ĐĂNG KÝ (Register)
// =========================================================
router.post('/register', async (req, res) => {
  const { id, fullName, phone, email, password, identityNo, role } = req.body;

  // Kiểm tra dữ liệu đầu vào tối thiểu
  if (!fullName || !email || !password || !phone) {
    return res.status(400).json({ error: 'Vui lòng điền đầy đủ họ tên, email, mật khẩu và số điện thoại!' });
  }

  try {
    // Kiểm tra xem email đã được đăng ký chưa
    const checkEmail = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (checkEmail.rows.length > 0) {
      return res.status(400).json({ error: 'Email này đã tồn tại trên hệ thống!' });
    }

    // Mã hóa mật khẩu an toàn
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo ID ngẫu nhiên nếu không truyền lên từ client
    const userId = id || `U-${Date.now()}`;
    const userRole = role || 'khach_hang';

    // Lưu người dùng vào CSDL Neon DB
    const newUser = await pool.query(
      `INSERT INTO users (id, full_name, phone, email, password, identity_no, role) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, full_name, email, role`,
      [userId, fullName, phone, email, hashedPassword, identityNo || null, userRole]
    );

    res.status(210).json({
      message: 'Đăng ký tài khoản thành công!',
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi hệ thống trong quá trình đăng ký.' });
  }
});

// =========================================================
// 2. API ĐĂNG NHẬP (Login)
// =========================================================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Vui lòng nhập email và mật khẩu!' });
  }

  try {
    // Tìm kiếm người dùng theo email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Tài khoản hoặc mật khẩu không chính xác.' });
    }

    const user = result.rows[0];

    // Đối soát mật khẩu đã mã hóa
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Tài khoản hoặc mật khẩu không chính xác.' });
    }

    // Tạo mã JWT Token bảo mật chứa thông tin ID, Email và Quyền (role)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'monalisa_secret_key_2026',
      { expiresIn: '7d' } // Token có hiệu lực trong 7 ngày
    );

    res.json({
      message: 'Đăng nhập thành công!',
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi hệ thống trong quá trình đăng nhập.' });
  }
});

export default router;