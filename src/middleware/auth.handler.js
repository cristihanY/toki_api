const jwt = require('jsonwebtoken');
const secret = process.env.MY_SECRET || 'my_secret';

function authenticateJWT(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token missing' });

  try {
    const decoded = jwt.verify(token, secret);
    req.user = {
      userId: decoded.sub,
      identifier: decoded.identifier,
      userName: decoded.userName,
      role: decoded.role,
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = authenticateJWT;
