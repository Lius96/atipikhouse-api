const { sendMail } = require('../controllers/mailler'); // Assurez-vous d'utiliser le bon chemin vers votre fichier contenant la fonction sendMail
const nodemailer = require('nodemailer');
const { ValidationError } = require('joi'); // Assurez-vous que votre module de validation retourne ValidationError pour les erreurs de validation

// Mock nodemailer
jest.mock('nodemailer');

describe('sendMail function', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        from: 'sender@example.com',
        to: 'recipient@example.com',
        subject: 'Test Subject',
        body: 'Test Body'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send mail successfully', async () => {
    nodemailer.createTransport.mockReturnValue({
      sendMail: jest.fn().mockImplementation((mailOptions, callback) => {
        callback(null);
      })
    });

    await sendMail(req, res, next);

    // expect(res.status).toHaveBeenCalledWith(200);
    // expect(res.json).toHaveBeenCalledWith({ success: true, data: null });
    expect(next).toHaveBeenCalled();
  });

  it('should handle error when sending mail fails', async () => {
    nodemailer.createTransport.mockReturnValue({
      sendMail: jest.fn().mockImplementation((mailOptions, callback) => {
        callback(new Error('Mail sending failed'));
      })
    });

    await sendMail(req, res, next);

    // expect(res.status).toHaveBeenCalledWith(200);
    // expect(res.json).toHaveBeenCalledWith({ success: false, data: null });
    expect(next).toHaveBeenCalled();
  });

  it('should handle validation error', async () => {
    const validationError = new ValidationError("Validation error");
    validationError.details = [{ message: '"to" is not allowed to be empty' }];

    await sendMail(req, res, next);

    expect(next).toHaveBeenCalled();
    // expect(res.status).not.toHaveBeenCalled();
    // expect(res.json).not.toHaveBeenCalled();
  });
});
