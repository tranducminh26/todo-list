const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Lấy danh sách task (Chỉ của user đã login)
router.get('/', auth, async (req, res) => {
    const [rows] = await db.execute('SELECT * FROM todos WHERE user_id = ?', [req.user.id]);
    res.json(rows);
});

// Tạo task mới
router.post('/', auth, async (req, res) => {
    const { title } = req.body;
    await db.execute('INSERT INTO todos (user_id, title) VALUES (?, ?)', [req.user.id, title]);
    res.json({ message: "Đã thêm công việc!" });
});

// Xóa task
router.delete('/:id', auth, async (req, res) => {
    await db.execute('DELETE FROM todos WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: "Đã xóa!" });
});

module.exports = router;