const Houses = require('../models/houses');
const {
  getHouse,
  
} = require('../controllers/houses');
const { ValidationError } = require('joi');

// Mock your models and other dependencies if needed

describe('Houses Controller', () => {
  // Test for getHouse function
  it('should get a single house', async () => {
    const req = { params: { id: 'house_id' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    
    // Mock Houses.findById to return a house
    Houses.findById = jest.fn().mockResolvedValue({ rowCount: 1, rows: [{ id: 'house_id', title: 'House Title', description: 'House Description' }] });

    await getHouse(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 'house_id', title: 'House Title', description: 'House Description' } });
    expect(next).not.toHaveBeenCalled();
  });

  // Add more tests for other functions as needed...
});
