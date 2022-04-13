const Booking = require('../models/booking')
const _ = require('underscore')
const asyncHandler = require('../middleware/async')
const moment = require('moment')
const ErrorReponse = require('../utils/errorResponse')
const { createBookingValidation, updateBookingValidation } = require('../utils/validations')


/**
 * @desc   Get All booking
 * @route   GET /api/v1/booking/
 * @access  Private
 */
exports.getBookings= asyncHandler(async (req, res) => {

  const result = await Booking.getAll()
  if (result.rowCount === 0) {
    res.status(204).json({ success: false,  message: `Booking is empty`})
  }else{
    res.status(200).json({ success: true, data: result.rows })
  }  
})


/**
 * @desc   Get All booking by house
 * @route   GET /api/v1/booking/house/:id
 * @access  Private
 */
exports.getHouseBooking= asyncHandler(async (req, res, next) => {
  if (!req.params.id) return next(new ErrorReponse('id is required', 400));
  const id = req.params.id;
  const result = await Booking.findByHouse(id)
  if (result.rowCount === 0) {
    res.status(204).json({ success: false,  message: `booking is empty for house ${id}`})
  }else{
    res.status(200).json({ success: true, data: result.rows })
  }  
})


/**
 * @desc   Get All booking by author
 * @route   GET /api/v1/booking/author/:id
 * @access  Private
 */
exports.getAuthorBooking= asyncHandler(async (req, res, next) => {
  if (!req.params.id) return next(new ErrorReponse('id is required', 400));
  const id = req.params.id;
  const result = await Booking.findByAuthor(id)
  if (result.rowCount === 0) {
    res.status(204).json({ success: false,  message: `booking is empty for user ${id}`})
  }else{
    res.status(200).json({ success: true, data: result.rows })
  }  
})

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
    reserved_names
    } = req.body
  const { error } = createBookingValidation(req.body)
  
  if (error) return next(new ErrorReponse(error.details[0].message, 400))

  const booking = new Booking(
      null,
      price,
      start_date,
      end_date,
      user_id,
      house,
      reserved_names
  )
  const result = await booking.save().catch(err => {
    next(err)
  })
  if (result) {
    res
      .status(200)
      .json({ success: true, data: result.rows[0].id })
  } 
})


/**
 * @desc    Edit booking
 * @route   PUT /api/v1/booking/:id
 * @access  Private
 */
exports.editBooking = asyncHandler(async (req, res, next) => {
  const { start_date,
    end_date,
} = req.body
  const id = req.params.id

  const { error } = updateBookingValidation(req.body)
  if (error) return next(new ErrorReponse(error.details[0].message, 400))

  const existbooking = await Booking.findById(id)

  if (existbooking.rowCount == 0) {
    return next(new ErrorReponse(`Booking not found with id of ${id}`, 404))
  }

  const booking = new Booking(
    id,
    null,
    start_date,
    end_date,
    null,
    null,
    null
  )

  const result = await booking.save().catch(err => {
      next(err)
  })

  if (result) {
    res
      .status(200)
      .json({ success: true, data: result.rows[0].id })
  }
})


/**
 * @desc    Delete booking
 * @route   DELETE /api/v1/booking/:id
 * @access  Private
 */
exports.deleteBooking = asyncHandler(async (req, res, next) => {
  const id = req.params.id

  const result = await Booking.deleteById(id)
  if (result.rowCount === 0) {
    return next(new ErrorReponse(`Booking not found with id of ${id}`, 400))
  }
  res.status(200).json({ success: true, data: id })
})
