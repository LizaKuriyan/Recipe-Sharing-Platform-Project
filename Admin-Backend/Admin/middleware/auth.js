const jwt = require('jsonwebtoken');
const User = require('../models/usermodel');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Unauthorized - Missing token' });

    const token = authHeader.split(' ')[1]; // Bearer <token>
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ message: 'Unauthorized - User not found' });

    if (user.status === "Blocked") {
      return res.status(403).json({ message: "Your account has been blocked by admin" });
    }

    req.user = user; // attach full user object
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};

module.exports = authMiddleware;