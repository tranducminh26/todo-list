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

// 3. Cập nhật trạng thái hoàn thành (Mark as Done/Undone)
router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { completed } = req.body; // gửi lên 1 hoặc 0
        const userId = req.user.id;

        // Chỉ cho phép cập nhật task của chính mình
        const [result] = await db.execute(
            'UPDATE todos SET completed = ? WHERE id = ? AND user_id = ?',
            [completed, id, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Không tìm thấy task hoặc bạn không có quyền!" });
        }

        res.json({ message: "Đã cập nhật trạng thái task!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
});

// 4. Xóa một task
router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const [result] = await db.execute(
            'DELETE FROM todos WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Không tìm thấy task hoặc bạn không có quyền!" });
        }

        res.json({ message: "Đã xóa task thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
});