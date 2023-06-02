const Booking = require("../models/booking");
const Houses = require("../models/houses");
const _ = require("underscore");
const asyncHandler = require("../middleware/async");
const moment = require("moment");
const Stripe = require("stripe");
const ErrorReponse = require("../utils/errorResponse");
const {
  createBookingValidation,
  updateBookingValidation,
  paymentsIntentmentValidation,
} = require("../utils/validations");

/**
 * @desc   Get All booking
 * @route   GET /api/v1/booking/
 * @access  Private
 */
exports.getBookings = asyncHandler(async (req, res) => {
  const result = await Booking.getAll();
  if (result.rowCount == 0) {
    res.status(200).json({ success: false, message: `Booking is empty` });
  } else {
    res.status(200).json({ success: true, data: result.rows });
  }
});

/**
 * @desc   Get  booking by id
 * @route   GET /api/v1/booking/:id
 * @access  Private
 */
exports.getBooking = asyncHandler(async (req, res, next) => {
  if (!req.params.id) return next(new ErrorReponse("id is required", 400));
  const id = req.params.id;

  const result = await Booking.findById(id);
  if (result.rowCount == 0) {
    res
      .status(200)
      .json({ success: false, message: `booking is empty for id ${id}` });
  } else {
    res.status(200).json({ success: true, data: result.rows });
  }
});

/**
 * @desc   Get All booking by house
 * @route   GET /api/v1/booking/house/:id
 * @access  Private
 */
exports.getHouseBooking = asyncHandler(async (req, res, next) => {
  if (!req.params.id) return next(new ErrorReponse("id is required", 400));
  const id = req.params.id;
  const result = await Booking.findByHouse(id);
  if (result.rowCount == 0) {
    res
      .status(200)
      .json({ success: false, message: `booking is empty for house ${id}` });
  } else {
    res.status(200).json({ success: true, data: result.rows });
  }
});


/**
 * @desc   Get All booking by owner
 * @route   GET /api/v1/booking/owner/:id
 * @access  Private
 */
exports.getOwnerBooking = asyncHandler(async (req, res, next) => {
  if (!req.params.id) return next(new ErrorReponse("id is required", 400));
  const id = req.params.id;
  const result = await Booking.findByOwer(id);
  if (result.rowCount == 0) {
    res
      .status(200)
      .json({ success: false, message: `booking is empty for owner ${id}` });
  } else {
    res.status(200).json({ success: true, data: result.rows });
  }
});

/**
 * @desc   Get All booking by author
 * @route   GET /api/v1/booking/author/:id
 * @access  Private
 */
exports.getAuthorBooking = asyncHandler(async (req, res, next) => {
  if (!req.params.id) return next(new ErrorReponse("id is required", 400));
  const id = req.params.id;
  const result = await Booking.findByAuthor(id);
  if (result.rowCount == 0) {
    res
      .status(200)
      .json({ success: false, message: `booking is empty for user ${id}` });
  } else {
    res.status(200).json({ success: true, data: result.rows });
  }
});

/**
 * @desc    Create booking
 * @route   POST /api/v1/booking/
 * @access  Private
 */
exports.createBooking = asyncHandler(async (req, res, next) => {
  const {
    price,
    start_date,
    end_date,
    house,
    user_id,
    reserved_names,
    billing_details,
  } = req.body;
  const { error } = createBookingValidation(req.body);

  if (error) return next(new ErrorReponse(error.details[0].message, 400));

  const booking = new Booking(
    null,
    price,
    start_date,
    end_date,
    user_id,
    house,
    reserved_names,
    billing_details,
    moment().unix(),
    
  );
  const result = await booking.save();  

  if (result) {
    if (await updateHouseOffDays(house, start_date, end_date)) {
      res.status(200).json({ success: true, data: result.rows[0].id });
    } else {
      res.status(200).json({ success: true, data: result.rows[0].id, msg: "" });
    }
  }
});

/**
 * @desc    Edit booking
 * @route   PUT /api/v1/booking/:id
 * @access  Private
 */
exports.editBooking = asyncHandler(async (req, res, next) => {
  if (!req.params.id) return next(new ErrorReponse("id is required", 400));
  const { start_date, end_date } = req.body;
  const id = req.params.id;

  const { error } = updateBookingValidation(req.body);
  if (error) return next(new ErrorReponse(error.details[0].message, 400));

  const existbooking = await Booking.findById(id);

  if (existbooking.rowCount == 0) {
    return next(new ErrorReponse(`Booking not found with id of ${id}`, 404));
  }

  const booking = new Booking(id, null, start_date, end_date, null, null, null);

  const result = await booking.save();

  if (result) {
    if (await updateHouseOffDays(id, start_date, end_date)) {
      res.status(200).json({ success: true, data: result.rows[0].id });
    } else {
      res.status(200).json({ success: true, data: result.rows[0].id, msg: "" });
    }
  }
});


/**
 * @desc    Edit booking status
 * @route   PUT /api/v1/booking/status/:id
 * @access  Private
 */
exports.editBookingStatus = asyncHandler(async (req, res, next) => {
  if (!req.params.id) return next(new ErrorReponse("id is required", 400));
  const { status } = req.body;
  const id = req.params.id;

  if (!req.body.status) return next(new ErrorReponse("status is required", 400));
  
  const existbooking = await Booking.findById(id);

  if (existbooking.rowCount == 0) {
    return next(new ErrorReponse(`Booking not found with id of ${id}`, 404));
  }
  
  const result = Booking.updateStatus(id, status);

  if (result) {
    res.status(200).json({ success: true, data: result });
  }
});

/**
 * @desc    Delete booking
 * @route   DELETE /api/v1/booking/:id
 * @access  Private
 */
exports.deleteBooking = asyncHandler(async (req, res, next) => {
  if (!req.params.id) return next(new ErrorReponse("id is required", 400));
  const id = req.params.id;

  const result = await Booking.deleteById(id);
  if (result.rowCount === 0) {
    return next(new ErrorReponse(`Booking not found with id of ${id}`, 400));
  }
  res.status(200).json({ success: true, data: id });
});

/**
 * @desc    Create payments intentment
 * @route   POST /api/v1/booking/payintentment
 * @access  Private
 */

exports.createIntentment = asyncHandler(async (req, res, next) => {
  const { amount, currency, paymentType } = req.body;
  const { error } = paymentsIntentmentValidation(req.body);

  if (error) return next(new ErrorReponse(error.details[0].message, 400));

  // init stripe
  const stripe = Stripe(process.env.STRIPESK);
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    payment_method_types: [paymentType],
  });

  if (!paymentIntent.id || !paymentIntent.client_secret) {
    return next(new ErrorReponse(`Error with payment. retry later`, 400));
  } else {
    res.status(200).json({ success: true, data: paymentIntent.client_secret });
  }
});

function getDatesInRange(startDate, endDate) {
  let startConv = new Date(startDate *1000),
  endConv = new Date(endDate* 1000);
  const date = new Date(startConv.getTime());

  const dates = [];

  while (date <= endConv) {
    dates.push(parseInt(date.getTime() / 1000));
    date.setDate(date.getDate() + 1);
  }
  return dates;
}

async function updateHouseOffDays(houseId, start, end) {
  const existHouse = await Houses.findById(houseId);
  if (existHouse.rowCount == 0) {
    return false;
  }
  
  let oldOffDays = await existHouse.rows[0].off_days;

  let reservedDates = await getDatesInRange(start, end);

  let newOffDays = [];

  if (reservedDates.length > 0) {
    newOffDays = _.union(oldOffDays, reservedDates);
  }
  
  const result = await Houses.updateHouseOffDays(houseId, newOffDays);
  if (result.rowCount != 0) {
    return true;
  }
}