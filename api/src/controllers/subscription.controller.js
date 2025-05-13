const { Subscription } = require('../models');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');

exports.subscribe = async (req, res) => {
  const { email, city, frequency } = req.body;

  if (!email || !city || !['hourly', 'daily'].includes(frequency)) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    const existing = await Subscription.findOne({ where: { email, city } });
    if (existing) {
      return res.status(409).json({ message: 'Email already subscribed' });
    }

    const token = uuidv4();

    await Subscription.create({
      email,
      city,
      frequency,
      token,
      confirmed: false
    });

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const confirmUrl = `http://localhost:${process.env.PORT || 3000}/api/confirm/${token}`;

    await transporter.sendMail({
      from: `"Weather API" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Confirm your weather subscription',
      html: `<p>Click to confirm: <a href="${confirmUrl}">${confirmUrl}</a></p>`
    });

    return res.status(200).json({ message: 'Subscription successful. Confirmation email sent.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.confirm = async (req, res) => {
  const { token } = req.params;

  try {
    const subscription = await Subscription.findOne({ where: { token } });

    if (!subscription) {
      return res.status(404).json({ message: 'Token not found' });
    }

    if (subscription.confirmed) {
      return res.status(200).json({ message: 'Already confirmed' });
    }

    subscription.confirmed = true;
    await subscription.save();

    return res.status(200).json({ message: 'Subscription confirmed successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.unsubscribe = async (req, res) => {
  const { token } = req.params;

  try {
    const subscription = await Subscription.findOne({ where: { token } });

    if (!subscription) {
      return res.status(404).json({ message: 'Token not found' });
    }

    await subscription.destroy();

    return res.status(200).json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
