const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');

// @route   POST api/contact
// @desc    Submit contact form
// @access  Public
router.post(
  '/',
  [
    body('name', 'Name is required').not().isEmpty().trim(),
    body('email', 'Please include a valid email').isEmail().normalizeEmail(),
    body('subject', 'Subject is required').not().isEmpty().trim(),
    body('category', 'Please select a valid category').isIn(['General', 'Support', 'Feedback', 'Partnership', 'Bug Report']),
    body('message', 'Message must be at least 10 characters').isLength({ min: 10 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, subject, category, message } = req.body;

    try {
      const newContact = new Contact({
        name,
        email,
        subject,
        category,
        message
      });

      await newContact.save();
      
      // Here you could add email notification logic if needed
      
      res.json({ msg: 'Message sent successfully!' });
    } catch (err) {
      console.error('Error saving contact form:', err);
      res.status(500).json({ errors: [{ msg: 'Server error' }] });
    }
  }
);

module.exports = router;
