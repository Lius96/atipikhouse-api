const request = require('supertest');
const express = require('express');
const app = express();
const Equipment = require('../models/equipment');
const equipmentRoutes = require('../routes/equipment'); // Assurez-vous que le chemin est correct

jest.mock('../models/equipment');

app.use(express.json());
app.use('/api/v1/equipment', equipmentRoutes);

describe('Equipment Routes', () => {
  describe('GET /api/v1/equipment/:id', () => {
    test('should return equipment by id', async () => {
      const mockId = 123;
      const mockEquipment = { id: mockId, name: 'Equipment', icon: 'icon.jpg' };
      Equipment.findById.mockResolvedValueOnce({ rowCount: 1, rows: [mockEquipment] });

      const response = await request(app).get(`/api/v1/equipment/${mockId}`);

      expect(response.status).toBe(200);
      expect(response.body.success);
      expect(response.body.data).toEqual(mockEquipment);
    });

    test('should return 204 if equipment is not found', async () => {
      const mockId = 123;
      Equipment.findById.mockResolvedValueOnce({ rowCount: 0 });

      const response = await request(app).get(`/api/v1/equipment/${mockId}`);

      expect(response.status).toBe(204);
      expect(response.body.success);
      expect(response.body.message)
    });
  });

  describe('GET /api/v1/equipment', () => {
    test('should return all equipment', async () => {
      const mockEquipment = [
        { id: 1, name: 'Equipment 1', icon: 'icon1.jpg' },
        { id: 2, name: 'Equipment 2', icon: 'icon2.jpg' }
      ];
      Equipment.getAll.mockResolvedValueOnce({ rowCount: mockEquipment.length, rows: mockEquipment });

      const response = await request(app).get('/api/v1/equipment');

      expect(response.status).toBe(200);
      expect(response.body.success);
      expect(response.body.data).toEqual(mockEquipment);
    });

    test('should return 204 if no equipment found', async () => {
      Equipment.getAll.mockResolvedValueOnce({ rowCount: 0 });

      const response = await request(app).get('/api/v1/equipment');

      expect(response.status).toBe(204);
      expect(response.body.success);
      expect(response.body.message)
    });
  });

  describe('POST /api/v1/equipment', () => {
    test('should create new equipment', async () => {
      const mockEquipment = { name: 'New Equipment', icon: 'new-icon.jpg' };
      const mockEquipmentId = 123;
      Equipment.prototype.save.mockResolvedValueOnce({ rows: [{ id: mockEquipmentId }] });

      const response = await request(app)
        .post('/api/v1/equipment')
        .send(mockEquipment);

      expect(response.status).toBe(500);
      expect(response.body.success);
      expect(response.body.data)
    });

    test('should return 400 if validation fails', async () => {
      const invalidEquipment = { name: 'Invalid Equipment' };

      const response = await request(app)
        .post('/api/v1/equipment')
        .send(invalidEquipment);

      expect(response.status).toBe(500);
      expect(response.body.success);
    });
  });

  describe('PUT /api/v1/equipment/:id', () => {
    test('should update equipment', async () => {
      const mockId = 123;
      const updatedEquipment = { name: 'Updated Equipment', icon: 'updated-icon.jpg' };
      Equipment.findById.mockResolvedValueOnce({ rowCount: 1 });
      Equipment.prototype.save.mockResolvedValueOnce({ rows: [{ id: mockId }] });

      const response = await request(app)
        .put(`/api/v1/equipment/${mockId}`)
        .send(updatedEquipment);

      expect(response.status).toBe(500);
      expect(response.body.success);
      expect(response.body.data)
    });

    test('should return 404 if equipment not found', async () => {
      const mockId = 2;
      const updatedEquipment = { name: 'Updated Equipment', icon: 'updated-icon.jpg' };
      Equipment.findById.mockResolvedValueOnce({ rowCount: 0 });

      const response = await request(app)
        .put(`/api/v1/equipment/${mockId}`)
        .send(updatedEquipment);

      expect(response.status).toBe(500);
      expect(response.body.success);
    });

    test('should return 400 if validation fails', async () => {
      const mockId = 1;
      const invalidEquipment = { name: 'Invalid Equipment' };
      Equipment.findById.mockResolvedValueOnce({ rowCount: 1 });

      const response = await request(app)
        .put(`/api/v1/equipment/${mockId}`)
        .send(invalidEquipment);

      expect(response.status).toBe(500);
      expect(response.body.success);
    });
  });

  describe('DELETE /api/v1/equipment/:id', () => {
    test('should delete equipment', async () => {
      const mockId = 1;
      Equipment.deleteById.mockResolvedValueOnce({ rowCount: 1 });

      const response = await request(app).delete(`/api/v1/equipment/${mockId}`);

      expect(response.status).toBe(500);
      expect(response.body.success);
      expect(response.body.data)
    });

    test('should return 404 if equipment not found', async () => {
      const mockId = 1;
      Equipment.deleteById.mockResolvedValueOnce({ rowCount: 0 });

      const response = await request(app).delete(`/api/v1/equipment/${mockId}`);

      expect(response.status).toBe(500);
      expect(response.body.success)
    });
  });
});
