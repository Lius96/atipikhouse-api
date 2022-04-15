const Houses = require('../models/houses')
const _ = require('underscore')
const asyncHandler = require('../middleware/async')
const moment = require('moment')
const ErrorReponse = require('../utils/errorResponse')
const { createHouseValidation } = require('../utils/validations')


/**
 * @desc   Get single house
 * @route   GET /api/v1/houses/:id
 * @access  Private
 */
exports.getHouse= asyncHandler(async (req, res, next) => {
  if (!req.params.id) return next(new ErrorReponse('id is required', 400));
  const id = req.params.id

  const result = await Houses.findById(id)
  if (result.rowCount == 0) {
    res.status(200).json({ success: false,  message: `house not found with id of ${id}`})
  }else{
    res.status(200).json({ success: true, data: result.rows[0] })
  }  
})


/**
 * @desc   Get All houses
 * @route   GET /api/v1/houses/
 * @access  Private
 */
exports.getHouses= asyncHandler(async (req, res) => {

  const result = await Houses.getAll()
  if (result.rowCount === 0) {
    res.status(200).json({ success: false,  message: `Houses is empty`})
  }else{
    res.status(200).json({ success: true, data: result.rows })
  }  
})


/**
 * @desc   Get All houses of author
 * @route   GET /api/v1/houses/author/:id
 * @access  Private
 */
exports.getAuthorHouses= asyncHandler(async (req, res, next) => {
  if (!req.params.id) return next(new ErrorReponse('id is required', 400));
  const id = req.params.id;
  const result = await Houses.findByAuthor(id)
  if (result.rowCount === 0) {
    res.status(200).json({ success: false,  message: `Houses is empty for author ${id}`})
  }else{
    res.status(200).json({ success: true, data: result.rows })
  }  
})

/**
 * @desc    Create house
 * @route   POST /api/v1/houses/
 * @access  Private
 */
exports.creatHouse = asyncHandler(async (req, res, next) => {
  const {
    title,
    description,
    status,
    type,
    nbr_couchage,
    capacity,
    price,
    photos,
    user_id,
    off_days,
    } = req.body
  const { error } = createHouseValidation(req.body)
  
  if (error) {
    res.status(204).json({ success: false, message: error.details[0].message })
    return;
  }

  const house = new Houses(
    null,
    title,
    description,
    status,
    type,
    nbr_couchage,
    capacity,
    price,
    photos,
    user_id,
    moment().unix(),
    null,
    off_days
  )
  const result = await house.save()
  if (result) {
    res
      .status(200)
      .json({ success: true, data: result.rows[0].id })
  } 
})


/**
 * @desc    Edit house
 * @route   PUT /api/v1/houses/:id
 * @access  Private
 */
exports.editHouse = asyncHandler(async (req, res, next) => {
  const { title,
    description,
    status,
    type,
    nbr_couchage,
    capacity,
    price,
    photos,
    user_id,
    off_days, } = req.body
  const id = req.params.id

  const { error } = createHouseValidation(req.body)
  if (error) return next(new ErrorReponse(error.details[0].message, 404))

  const existHouse = await Houses.findById(id)

  if (existHouse.rowCount == 0) {
    return next(new ErrorReponse(`House not found with id of ${id}`, 404))
  }

  const house = new Houses(
    id,
    title,
    description,
    status,
    type,
    nbr_couchage,
    capacity,
    price,
    photos,
    null,
    null,
    user_id,
    off_days,
    moment().unix(),
  )

  const result = await house.save()

  if (result) {
    res
      .status(200)
      .json({ success: true, data: result.rows[0].id })
  }
})


/**
 * @desc    Delete house
 * @route   DELETE /api/v1/houses/:id
 * @access  Private
 */
exports.deleteHouse = asyncHandler(async (req, res, next) => {
  if (!req.params.id) return next(new ErrorReponse('id is required', 400));
  const id = req.params.id
  const result = await Houses.deleteById(id)
  if (result.rowCount === 0) {
    return next(new ErrorReponse(`House not found with id of ${id}`, 404))
  }
  res.status(200).json({ success: true, data: id })
})
