const {
  subscribe,
  confirm,
  unsubscribe
} = require('../../src/controllers/subscription.controller');
const { Subscription } = require('../../src/models');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');

jest.mock('../../src/models');
jest.mock('nodemailer');
jest.mock('express-validator');

const mockSendMail = jest.fn();
nodemailer.createTransport.mockReturnValue({ sendMail: mockSendMail });

const buildRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn();
  return res;
};

describe('subscription.controller - subscribe', () => {
  let req;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        city: 'Kyiv',
        frequency: 'daily'
      }
    };
    validationResult.mockReturnValue({ isEmpty: () => true });
    Subscription.findOne.mockResolvedValue(null);
    Subscription.create.mockResolvedValue({});
    mockSendMail.mockResolvedValue(true);
  });

  it('should return 400 if validation fails', async () => {
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: 'Invalid email' }]
    });

    const res = buildRes();
    await subscribe(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email' });
  });

  it('should return 409 if email already subscribed', async () => {
    Subscription.findOne.mockResolvedValue({});

    const res = buildRes();
    await subscribe(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email already subscribed' });
  });

  it('should return 200 on successful subscription', async () => {
    const res = buildRes();
    await subscribe(req, res);

    expect(mockSendMail).toHaveBeenCalled();
    expect(Subscription.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Subscription successful. Confirmation email sent.'
    });
  });

  it('should return 500 if sendMail fails', async () => {
    mockSendMail.mockRejectedValue(new Error('SMTP error'));

    const res = buildRes();
    await subscribe(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});

describe('subscription.controller - confirm', () => {
  let req;

  beforeEach(() => {
    req = { params: { token: '1234-token' } };
  });

  it('should return 404 if token is not found', async () => {
    Subscription.findOne.mockResolvedValue(null);

    const res = buildRes();
    await confirm(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token not found' });
  });

  it('should return 200 if already confirmed', async () => {
    Subscription.findOne.mockResolvedValue({ confirmed: true });

    const res = buildRes();
    await confirm(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Already confirmed' });
  });

  it('should confirm subscription and return 200', async () => {
    const save = jest.fn();
    Subscription.findOne.mockResolvedValue({ confirmed: false, save });

    const res = buildRes();
    await confirm(req, res);

    expect(save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Subscription confirmed successfully' });
  });
});

describe('subscription.controller - unsubscribe', () => {
  let req;

  beforeEach(() => {
    req = { params: { token: '1234-token' } };
  });

  it('should return 404 if token not found', async () => {
    Subscription.findOne.mockResolvedValue(null);

    const res = buildRes();
    await unsubscribe(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token not found' });
  });

  it('should delete subscription and return 200', async () => {
    const destroy = jest.fn();
    Subscription.findOne.mockResolvedValue({ destroy });

    const res = buildRes();
    await unsubscribe(req, res);

    expect(destroy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unsubscribed successfully' });
  });
});
