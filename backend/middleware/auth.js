const { clerkClient } = require('@clerk/clerk-sdk-node');

// Middleware to verify Clerk JWT tokens
const verifyClerkToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the session token with Clerk
    const sessionToken = await clerkClient.verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY
    });

    if (!sessionToken) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }

    // Get user information from Clerk
    const userId = sessionToken.sub;
    const user = await clerkClient.users.getUser(userId);

    // Attach user info to request
    req.auth = {
      userId: userId,
      user: user
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

// Optional auth middleware - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.auth = null;
      return next();
    }

    const token = authHeader.split(' ')[1];
    const sessionToken = await clerkClient.verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY
    });

    if (sessionToken) {
      const userId = sessionToken.sub;
      const user = await clerkClient.users.getUser(userId);
      
      req.auth = {
        userId: userId,
        user: user
      };
    } else {
      req.auth = null;
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    req.auth = null;
    next();
  }
};

module.exports = {
  verifyClerkToken,
  optionalAuth
};