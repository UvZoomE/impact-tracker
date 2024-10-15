import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
  console.log('Auth middleware called');
  
  if (process.env.NODE_ENV === 'development') {
    console.log('Authentication bypassed for development');
    // Find or create a development user
    try {
      let devUser = await User.findOne({ email: 'dev@example.com' });
      if (!devUser) {
        devUser = new User({
          email: 'dev@example.com',
          name: 'Development User',
          isVerified: true,
          profileCompleted: true,
          password: 'devpassword' // Add a password for the dev user
        });
        await devUser.save();
      }
      req.userId = devUser._id;
      return next();
    } catch (error) {
      console.error('Error in dev auth:', error);
      return res.status(500).json({ message: 'Server error in dev auth' });
    }
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log('No Authorization header provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log('No token found in Authorization header');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default authMiddleware;
