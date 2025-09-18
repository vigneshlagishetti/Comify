const express = require('express');
const { verifyClerkToken } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { db } = require('../config/database');
const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', verifyClerkToken, async (req, res, next) => {
  try {
    const { data: user, error } = await db.users.getByClerkId(req.auth.userId);
    
    if (error) {
      return res.status(404).json({
        success: false,
        error: 'User profile not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', verifyClerkToken, validateRequest('updateUser'), async (req, res, next) => {
  try {
    const updateData = {
      ...req.body,
      updated_at: new Date().toISOString()
    };

    const { data: updatedUser, error } = await db.users.updateByClerkId(
      req.auth.userId,
      updateData
    );

    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Failed to update user profile',
        details: error.message
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser[0]
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID (admin only)
// @access  Private
router.get('/:id', verifyClerkToken, async (req, res, next) => {
  try {
    // For now, we'll skip admin check - in production, add admin role verification
    const { data: user, error } = await db.users.getById(req.params.id);
    
    if (error) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private
router.get('/', verifyClerkToken, async (req, res, next) => {
  try {
    // For now, we'll skip admin check - in production, add admin role verification
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const { data: users, error } = await db.users.getAll(limit, offset);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Failed to fetch users',
        details: error.message
      });
    }

    res.json({
      success: true,
      data: users,
      pagination: {
        limit,
        offset,
        total: users.length
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;