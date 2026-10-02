const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');
const { memStore, isMongoActive } = require('../utils/store');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = verifyToken(token);

      if (isMongoActive()) {
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
          return res.status(401).json({ success: false, message: 'User account not found' });
        }
        req.user = user;
      } else {
        const user = memStore.users.find(u => u._id.toString() === decoded.id.toString());
        if (!user) {
          return res.status(401).json({ success: false, message: 'User account not found' });
        }
        const { password, ...userWithoutPassword } = user;
        req.user = userWithoutPassword;
      }

      return next();
    } catch (error) {
      console.error('[Auth Middleware] Token error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
