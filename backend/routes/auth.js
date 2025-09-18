const express = require('express');
const { verifyClerkToken } = require('../middleware/auth');
const { db } = require('../config/database');
const router = express.Router();

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', verifyClerkToken, async (req, res, next) => {
  try {
    const { data: user, error } = await db.users.getByClerkId(req.auth.userId);
    
    if (error) {
      return res.status(404).json({
        success: false,
        error: 'User not found in database'
      });
    }

    res.json({
      success: true,
      data: {
        user,
        clerkUser: req.auth.user
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/sync-user
// @desc    Sync user data from Clerk to our database
// @access  Private
router.post('/sync-user', verifyClerkToken, async (req, res, next) => {
  try {
    const clerkUser = req.auth.user;
    
    // Check if user exists
    const { data: existingUser } = await db.users.getByClerkId(clerkUser.id);
    
    if (existingUser) {
      return res.json({
        success: true,
        message: 'User already exists',
        data: existingUser
      });
    }

    // Create new user
    const userData = {
      clerk_id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress,
      full_name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
      mobile_no: clerkUser.phoneNumbers[0]?.phoneNumber || null,
      gender: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: newUser, error } = await db.users.create(userData);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Failed to create user profile',
        details: error.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'User profile created successfully',
      data: newUser[0]
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/auth/status
// @desc    Check authentication status
// @access  Public
router.get('/status', verifyClerkToken, (req, res) => {
  res.json({
    success: true,
    authenticated: true,
    user: {
      id: req.auth.userId,
      email: req.auth.user.emailAddresses[0]?.emailAddress,
      name: `${req.auth.user.firstName || ''} ${req.auth.user.lastName || ''}`.trim()
    }
  });
});

module.exports = router;