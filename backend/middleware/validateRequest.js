const Joi = require('joi');

// Validation schemas
const schemas = {
  // User validation
  updateUser: Joi.object({
    full_name: Joi.string().min(2).max(100),
    mobile_no: Joi.string().pattern(/^\+?[\d\s-()]+$/).min(10).max(15),
    gender: Joi.string().valid('male', 'female', 'other')
  }),

  // Company validation
  createCompany: Joi.object({
    company_name: Joi.string().min(2).max(200).required(),
    company_type: Joi.string().valid(
      'private_limited',
      'public_limited', 
      'partnership',
      'sole_proprietorship',
      'llp'
    ).required(),
    industry: Joi.string().min(2).max(100).required(),
    employee_count: Joi.string().valid(
      '1-10',
      '11-50',
      '51-200',
      '201-500',
      '500+'
    ).required(),
    address: Joi.string().min(10).max(500).required(),
    city: Joi.string().min(2).max(100).required(),
    state: Joi.string().min(2).max(100).required(),
    pincode: Joi.string().pattern(/^\d{6}$/).required(),
    company_description: Joi.string().min(50).max(1000).required(),
    website: Joi.string().uri().allow('', null).optional()
  }),

  updateCompany: Joi.object({
    company_name: Joi.string().min(2).max(200),
    company_type: Joi.string().valid(
      'private_limited',
      'public_limited',
      'partnership', 
      'sole_proprietorship',
      'llp'
    ),
    industry: Joi.string().min(2).max(100),
    employee_count: Joi.string().valid(
      '1-10',
      '11-50',
      '51-200', 
      '201-500',
      '500+'
    ),
    address: Joi.string().min(10).max(500),
    city: Joi.string().min(2).max(100),
    state: Joi.string().min(2).max(100),
    pincode: Joi.string().pattern(/^\d{6}$/),
    company_description: Joi.string().min(50).max(1000),
    website: Joi.string().uri().allow('', null)
  }),

  // Verification status update
  updateVerificationStatus: Joi.object({
    verification_status: Joi.string().valid('pending', 'verified', 'rejected').required(),
    verification_notes: Joi.string().max(500).allow('', null).optional()
  })
};

// Middleware to validate request body against schema
const validateRequest = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    
    if (!schema) {
      return res.status(500).json({
        success: false,
        error: 'Validation schema not found'
      });
    }

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: false
    });

    if (error) {
      const errorMessages = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errorMessages
      });
    }

    // Replace req.body with validated and sanitized data
    req.body = value;
    next();
  };
};

module.exports = validateRequest;