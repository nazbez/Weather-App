const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscription.controller');
const { body } = require('express-validator');

router.post(
  '/subscribe',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('city').notEmpty().withMessage('City is required'),
    body('frequency').isIn(['daily', 'hourly']).withMessage('Invalid frequency')
  ],
  subscriptionController.subscribe
);
router.get('/confirm/:token', subscriptionController.confirm);
router.get('/unsubscribe/:token', subscriptionController.unsubscribe);

module.exports = router;
