const Houses = require('../models/houses')
const _ = require('underscore')
const asyncHandler = require('../middleware/async')
const moment = require('moment')
const ErrorReponse = require('../utils/errorResponse')
const { uploadPath } = require('../uploadPath')

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
 * @desc   Get All booked houses of author
 * @route   GET /api/v1/houses/booked/author/:id
 * @access  Private
 */
exports.getAuthorBookedHouses= asyncHandler(async (req, res, next) => {
  if (!req.params.id) return next(new ErrorReponse('id is required', 400));
  const id = req.params.id;
  const result = await Houses.findHousesBookedByAuthor(id)
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
    location,
    equipements
    } = req.body
  const { error } = createHouseValidation(req.body)
  
  if (error) {
    return res.status(200).json({ success: false, message: error.details[0].message })
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
    off_days,
    null,
    location,
    equipements
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
    off_days, location, equipements } = req.body
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
    location,
    equipements
  )

  const result = await house.save()

  if (result) {
    res
      .status(200)
      .json({ success: true, data: result.rows[0].id })
  }
})

/**
 * @desc    Edit house notification
 * @route   PUT /api/v1/houses/notification/:id
 * @access  Private
 */
 exports.editHouseNotify = asyncHandler(async (req, res, next) => {
  if (_.isUndefined(req.body.notification) || !_.isBoolean(req.body.notification)) return next(new ErrorReponse('notification is required', 404))
  const { notification } = req.body
  const id = req.params.id
  
  const existHouse = await Houses.findById(id)

  if (existHouse.rowCount == 0) {
    return next(new ErrorReponse(`House not found with id of ${id}`, 404))
  }

  const result = await Houses.updateNotify(id, notification)

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


/**
 * @desc   upload house image 
 * @route   POST /api/v1/houses/images
 * @access  Private
 */
exports.uploadFiles = asyncHandler(async (req, res, next) => {
  let storedFiles = [];
  if ( !req.files || Object.keys(req.files).length === 0) {
    res.status(202).json({
      status: false,
      message: 'Error file not uploaded'
    })
  }

  for (let i = 0; i < Object.keys(req.files).length; i++) {
    let file = req.files['images'+i];
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/webp') {
      file.mv(uploadPath + file.name, function(err){
        if (err) {
          // console.log('error')
          return res.status(202).json({
            success: false,
            message: 'Error file not uploaded'
          }) 
          // console.log('atta')
        }
      })
    }
    storedFiles.push(process.env.ENV == 'development' ? 'http://' : 'https://' +process.env.IMGHOST+':'+process.env.PORT+'/images/'+file.name)
  }
   res.status(200).json({ success: true, files: await storedFiles })
})
