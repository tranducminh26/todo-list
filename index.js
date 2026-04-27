const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('.')); // Dòng này giúp Server hiểu và lấy các file HTML, CSS, JS trong thư mục gốc

// Định nghĩa routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

const db = require('./db');

async function testConnection() {
    try {
        await db.query('SELECT 1');
        console.log('✅ Kết nối MySQL trên Railway thành công!');
    } catch (err) {
        console.error('❌ Lỗi kết nối Database:', err.message);
    }
}

testConnection();