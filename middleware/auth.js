const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Truy cập bị từ chối. Không có token." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Gán thông tin user (id) vào request
        next();
    } catch (err) {
        res.status(400).json({ message: "Token không hợp lệ." });
    }
};