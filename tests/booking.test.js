const axios = require('axios'); // Si vous utilisez Axios dans vos fonctions
jest.mock("axios");

const { getBookings } = require('../controllers/booking');
const Booking = require('../models/booking');

jest.mock('../models/booking');

describe('getBookings function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return all bookings if available', async () => {
    const mockBookingData = [
      { id: 1, date: '2024-04-24' },
      { id: 2, date: '2024-04-25'},
      // Other mock booking data
    ];
    
    Booking.getAll.mockResolvedValueOnce({ rowCount: mockBookingData.length, rows: mockBookingData });

    const req = {};
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    await getBookings(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: mockBookingData });
  });

  test('should return an empty message if no bookings available', async () => {
    Booking.getAll.mockResolvedValueOnce({ rowCount: 0 });

    const req = {};
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    await getBookings(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Booking is empty' });
  });
  
});
