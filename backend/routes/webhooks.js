const express = require('express');
const { Webhook } = require('svix');
const { db } = require('../config/database');
const router = express.Router();

// @route   POST /api/webhooks/clerk
// @desc    Handle Clerk webhooks for user events
// @access  Public (but verified by Clerk signature)
router.post('/clerk', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    
    if (!WEBHOOK_SECRET || WEBHOOK_SECRET === 'your_webhook_secret_here') {
      console.log('⚠️  Webhook secret not configured - webhooks disabled for development');
      return res.status(200).json({
        success: true,
        message: 'Webhook endpoint ready (secret not configured for development)'
      });
    }

    // Get the headers
    const svix_id = req.get('svix-id');
    const svix_timestamp = req.get('svix-timestamp');
    const svix_signature = req.get('svix-signature');

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing required Svix headers'
      });
    }

    // Get the body
    const body = req.body;
    
    // Create a new Svix instance with your secret
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt;

    // Verify the payload with the headers
    try {
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      });
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return res.status(400).json({
        success: false,
        error: 'Webhook verification failed'
      });
    }

    // Handle the webhook
    const { id, type, data } = evt;
    console.log(`Webhook ${id} with type ${type}`);

    switch (type) {
      case 'user.created':
        await handleUserCreated(data);
        break;
      
      case 'user.updated':
        await handleUserUpdated(data);
        break;
      
      case 'user.deleted':
        await handleUserDeleted(data);
        break;
      
      default:
        console.log(`Unhandled webhook type: ${type}`);
    }

    res.status(200).json({
      success: true,
      message: 'Webhook processed successfully'
    });
    
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      success: false,
      error: 'Webhook processing failed'
    });
  }
});

// Helper functions for webhook handling
async function handleUserCreated(userData) {
  try {
    console.log('Processing user.created webhook:', userData.id);
    
    // Check if user already exists
    const { data: existingUser } = await db.users.getByClerkId(userData.id);
    
    if (existingUser) {
      console.log('User already exists in database:', userData.id);
      return;
    }

    // Create user in our database
    const userRecord = {
      clerk_id: userData.id,
      email: userData.email_addresses?.[0]?.email_address,
      full_name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
      mobile_no: userData.phone_numbers?.[0]?.phone_number || null,
      gender: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await db.users.create(userRecord);
    
    if (error) {
      console.error('Failed to create user from webhook:', error);
    } else {
      console.log('User created successfully from webhook:', data[0].id);
    }
    
  } catch (error) {
    console.error('Error in handleUserCreated:', error);
  }
}

async function handleUserUpdated(userData) {
  try {
    console.log('Processing user.updated webhook:', userData.id);
    
    const updateData = {
      email: userData.email_addresses?.[0]?.email_address,
      full_name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
      mobile_no: userData.phone_numbers?.[0]?.phone_number || null,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await db.users.updateByClerkId(userData.id, updateData);
    
    if (error) {
      console.error('Failed to update user from webhook:', error);
    } else {
      console.log('User updated successfully from webhook:', userData.id);
    }
    
  } catch (error) {
    console.error('Error in handleUserUpdated:', error);
  }
}

async function handleUserDeleted(userData) {
  try {
    console.log('Processing user.deleted webhook:', userData.id);
    
    // For now, we'll just log it. In production, you might want to:
    // 1. Soft delete the user
    // 2. Anonymize their data
    // 3. Delete associated companies
    // 4. Clean up any uploaded files
    
    console.log('User deletion webhook received for:', userData.id);
    // TODO: Implement user deletion logic
    
  } catch (error) {
    console.error('Error in handleUserDeleted:', error);
  }
}

module.exports = router;