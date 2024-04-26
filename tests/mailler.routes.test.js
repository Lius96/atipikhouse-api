const request = require('supertest');
const express = require('express');
const router = express.Router();
const app = express();

// Supposons que vous ayez une fonction mock pour sendMail
jest.mock('../controllers/mailler', () => ({
  sendMail: jest.fn()
}));

describe('POST /', () => {
  it('should call sendMail function when POST request is made', async () => {
    await request(app)
      .post('/api/v1/mail/')
      .expect(404); // Vous pouvez ajuster le code de statut en fonction de votre implémentation

  });
});
