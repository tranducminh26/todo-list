const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

// Đăng ký
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        res.status(201).json({ message: "Đăng ký thành công!" });
    } catch (err) {
        res.status(500).json({ message: "Tên đăng nhập đã tồn tại hoặc lỗi server." });
    }
});

// Đăng nhập
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [users] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) return res.status(400).json({ message: "User không tồn tại." });

        const validPass = await bcrypt.compare(password, users[0].password);
        if (!validPass) return res.status(400).json({ message: "Sai mật khẩu." });

        const token = jwt.sign({ id: users[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server." });
    }
});

module.exports = router;