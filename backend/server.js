// 1. Thêm import router tài khoản này vào đầu file server.js:
import authRoute from './authRoute.js';
import roomsRoute from './roomsRoute.js';
import bookingsRoute from './bookingsRoute.js';
import invoicesRoute from './invoicesRoute.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


// ... Giữ nguyên phần middleware cũ (cors, express.json) ...


app.use(cors());
app.use(express.json());

app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      message: 'Kết nối Database Neon thành công!',
      timestamp: result.rows[0].now,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi kết nối CSDL' });
  }
});

app.get('/', (req, res) => {
  res.send('Monalisa Hotel API Server...');
});
// 2. Thêm dòng khai báo API route này vào dưới phần cấu hình middleware:
app.use('/api/auth', authRoute);
app.use('/api/rooms', roomsRoute); 
app.use('/api/bookings', bookingsRoute); 
app.use('/api/invoices', invoicesRoute); 
app.listen(PORT, () => {
  console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});