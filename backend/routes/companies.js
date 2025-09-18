const express = require('express');
const { verifyClerkToken } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { db } = require('../config/database');
const router = express.Router();

// @route   POST /api/companies
// @desc    Create new company (with automatic VINSA branding)
// @access  Private
router.post('/', verifyClerkToken, validateRequest('createCompany'), async (req, res, next) => {
  try {
    // Get user from database
    const { data: user, error: userError } = await db.users.getByClerkId(req.auth.userId);
    
    if (userError || !user) {
      return res.status(404).json({
        success: false,
        error: 'User profile not found. Please complete your profile first.'
      });
    }

    // Check if user already has a company
    const { data: existingCompany } = await db.companies.getByOwnerId(user.id);
    
    if (existingCompany) {
      return res.status(400).json({
        success: false,
        error: 'User already has a registered company'
      });
    }

    // Create company data with VINSA branding (automatic in db.companies.create)
    const companyData = {
      owner_id: user.id,
      ...req.body,
      verification_status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: newCompany, error } = await db.companies.create(companyData);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Failed to create company profile',
        details: error.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Company registered successfully with VINSA branding!',
      data: newCompany[0]
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/companies/my-company
// @desc    Get current user's company
// @access  Private
router.get('/my-company', verifyClerkToken, async (req, res, next) => {
  try {
    // Get user from database
    const { data: user, error: userError } = await db.users.getByClerkId(req.auth.userId);
    
    if (userError || !user) {
      return res.status(404).json({
        success: false,
        error: 'User profile not found'
      });
    }

    const { data: company, error } = await db.companies.getByOwnerId(user.id);
    
    if (error || !company) {
      return res.status(404).json({
        success: false,
        error: 'Company not found'
      });
    }

    res.json({
      success: true,
      data: company
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/companies/my-company
// @desc    Update current user's company
// @access  Private
router.put('/my-company', verifyClerkToken, validateRequest('updateCompany'), async (req, res, next) => {
  try {
    // Get user from database
    const { data: user, error: userError } = await db.users.getByClerkId(req.auth.userId);
    
    if (userError || !user) {
      return res.status(404).json({
        success: false,
        error: 'User profile not found'
      });
    }

    // Get user's company
    const { data: company, error: companyError } = await db.companies.getByOwnerId(user.id);
    
    if (companyError || !company) {
      return res.status(404).json({
        success: false,
        error: 'Company not found'
      });
    }

    const updateData = {
      ...req.body,
      updated_at: new Date().toISOString()
    };

    const { data: updatedCompany, error } = await db.companies.update(company.id, updateData);

    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Failed to update company profile',
        details: error.message
      });
    }

    res.json({
      success: true,
      message: 'Company profile updated successfully (VINSA branding maintained)',
      data: updatedCompany[0]
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/companies/:id
// @desc    Get company by ID
// @access  Private
router.get('/:id', verifyClerkToken, async (req, res, next) => {
  try {
    const { data: company, error } = await db.companies.getById(req.params.id);
    
    if (error || !company) {
      return res.status(404).json({
        success: false,
        error: 'Company not found'
      });
    }

    res.json({
      success: true,
      data: company
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/companies
// @desc    Get all companies (with filters)
// @access  Private
router.get('/', verifyClerkToken, async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    
    // Extract filters from query parameters
    const filters = {};
    if (req.query.verification_status) filters.verification_status = req.query.verification_status;
    if (req.query.company_type) filters.company_type = req.query.company_type;
    if (req.query.city) filters.city = req.query.city;
    if (req.query.state) filters.state = req.query.state;

    const { data: companies, error } = await db.companies.getAll(limit, offset, filters);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Failed to fetch companies',
        details: error.message
      });
    }

    res.json({
      success: true,
      data: companies,
      pagination: {
        limit,
        offset,
        total: companies.length
      },
      filters
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/companies/:id/verification
// @desc    Update company verification status (admin only)
// @access  Private
router.put('/:id/verification', verifyClerkToken, validateRequest('updateVerificationStatus'), async (req, res, next) => {
  try {
    // For now, we'll skip admin check - in production, add admin role verification
    const { verification_status, verification_notes } = req.body;

    const { data: updatedCompany, error } = await db.companies.updateVerificationStatus(
      req.params.id,
      verification_status,
      verification_notes
    );

    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Failed to update verification status',
        details: error.message
      });
    }

    res.json({
      success: true,
      message: `Company verification status updated to: ${verification_status}`,
      data: updatedCompany[0]
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/companies/search
// @desc    Search companies
// @access  Private
router.get('/search/:term', verifyClerkToken, async (req, res, next) => {
  try {
    const searchTerm = req.params.term;
    const limit = parseInt(req.query.limit) || 20;

    const { data: companies, error } = await db.companies.search(searchTerm, limit);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Search failed',
        details: error.message
      });
    }

    res.json({
      success: true,
      data: companies,
      search: {
        term: searchTerm,
        results: companies.length,
        limit
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;