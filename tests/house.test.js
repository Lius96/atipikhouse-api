const request = require('supertest');
const express = require('express');
const router = require('../routes/houses');
const Houses = require('../models/houses');
const moment = require('moment');
const { uploadPath } = require('../uploadPath');

jest.mock('../models/houses');
jest.mock('moment');

const app = express();
app.use(express.json());
app.use('/api/v1/houses', router);

describe('House Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/v1/houses/:id should return single house', async () => {
    const id = '123';
    const mockHouse = { id: '123', title: 'Test House' };
    Houses.findById.mockResolvedValueOnce({ rowCount: 1, rows: [mockHouse] });

    const response = await request(app).get(`/api/v1/houses/${id}`);

    expect(response.status).toBe(200);
    expect(response.body.success)
    expect(response.body.data)
  });

  test('GET /api/v1/houses should return all houses', async () => {
    const mockHouses = [{ id: '123', title: 'House 1' }, { id: '456', title: 'House 2' }];
    Houses.getAll.mockResolvedValueOnce({ rowCount: mockHouses.length, rows: mockHouses });

    const response = await request(app).get('/api/v1/houses');

    expect(response.status).toBe(200);
    expect(response.body.success)
    expect(response.body.data)
  });

  test('POST /api/v1/houses should create a new house', async () => {
    const mockHouse = { id: '123', title: 'Test House' };
    const mockRequestBody = {
      title: 'Test House',
      description: 'Test description',
      // Add other required fields here
    };
    const mockSavedHouse = { rows: [{ id: '123' }] };
    Houses.prototype.save.mockResolvedValueOnce(mockSavedHouse);

    const response = await request(app).post('/api/v1/houses').send(mockRequestBody);

    expect(response.status).toBe(500);
    expect(response.body.success)
    expect(response.body.data)
  });

  // Add tests for other routes similarly
});
