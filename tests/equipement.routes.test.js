const express = require('express');
const request = require('supertest');
//const router = require('../routes/equipement');
const {
  getEquipment,
  getEquipments,
  creatEquipment,
  editEquipment,
  deleteEquipment
} = require('../controllers/equipement');
const { protect } = require('../middleware/auth');

jest.mock('../controllers/equipement');
jest.mock('../middleware/auth');

describe('Equipment Routes', () => {
  const app = express();
  app.use(express.json());

  test('GET /equipement', async () => {
    await request(app).get('/equipement');
    expect(getEquipments).toHaveBeenCalled();
  });

  test('POST /equipement', async () => {
    protect.mockImplementation((req, res, next) => next());
    await request(app).post('/equipement');
    expect(protect).toHaveBeenCalled();
    expect(creatEquipment).toHaveBeenCalled();
  });

  test('GET /equipement/:id', async () => {
    await request(app).get('/equipement/123');
    expect(getEquipment).toHaveBeenCalledWith(expect.objectContaining({ params: { id: '123' } }));
  });

  test('PUT /equipement/:id', async () => {
    protect.mockImplementation((req, res, next) => next());
    await request(app).put('/equipement/123');
    expect(protect).toHaveBeenCalled();
    expect(editEquipment).toHaveBeenCalledWith(expect.objectContaining({ params: { id: '123' } }));
  });

  test('DELETE /equipement/:id', async () => {
    protect.mockImplementation((req, res, next) => next());
    await request(app).delete('/equipement/123');
    expect(protect).toHaveBeenCalled();
    expect(deleteEquipment).toHaveBeenCalledWith(expect.objectContaining({ params: { id: '123' } }));
  });
});
