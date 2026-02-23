const pool = require('../config/db');
const jwt = require('jsonwebtoken');

exports.getBalance = async (req, res) => {
  const token = req.cookies.jwt_token;

  // Check if token exists
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token found. Please login.' });
  }

  try {
    // Verify JWT signature
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token. Please login again.' });
    }

    // Check token exists in DB and not expired
    const [tokenRows] = await pool.execute(
      'SELECT * FROM UserToken WHERE token = ? AND expairy > NOW()',
      [token]
    );

    if (tokenRows.length === 0) {
      return res.status(401).json({ success: false, message: 'Session expired. Please login again.' });
    }

    // Fetch balance using username from token
    const [users] = await pool.execute(
      'SELECT balance, username FROM KodUser WHERE username = ?',
      [decoded.sub]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({
      success: true,
      balance: users[0].balance,
      username: users[0].username,
    });

  } catch (err) {
    console.error('Balance error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};
