const Equipment = require('../models/equipment')
const _ = require('underscore')
const asyncHandler = require('../middleware/async')
const moment = require('moment')
const ErrorReponse = require('../utils/errorResponse')
const { createEquipmentValidation } = require('../utils/validations')


/**
 * @desc   Get single pgae
 * @route   GET /api/v1/equipment/:id
 * @access  Private
 */
exports.getEquipment= asyncHandler(async (req, res, next) => {
  if (!req.params.id) return next(new ErrorReponse('id is required', 400));
  const id = req.params.id

  const result = await Equipment.findById(id)
  if (result.rowCount === 0) {
    res.status(204).json({ success: false,  message: `equipement not found with id of ${id}`})
  }else{
    res.status(200).json({ success: true, data: result.rows[0] })
  }  
})


/**
 * @desc   Get All page
 * @route   GET /api/v1/equipment/
 * @access  Private
 */
exports.getEquipments= asyncHandler(async (req, res) => {

  const result = await Equipment.getAll()
  if (result.rowCount === 0) {
    res.status(204).json({ success: false,  message: `Equipement is empty`})
  }else{
    res.status(200).json({ success: true, data: result.rows })
  }  
})

/**
 * @desc    Create page
 * @route   POST /api/v1/equipment/
 * @access  Private
 */
exports.creatEquipment = asyncHandler(async (req, res, next) => {
  const {
    name,
    icon
    } = req.body
  const { error } = createEquipmentValidation(req.body)
  
  if (error) return res.status(400).json({ success: false, message: error.details[0].message })

  const equip = new Equipment(
    null,
    name,
    icon,
  )
  const result = await equip.save()
  if (result) {
    res.status(200).json({ success: true, data: result.rows[0].id }) 
  } 
})


/**
 * @desc    Edit page
 * @route   PUT /api/v1/equipment/:id
 * @access  Private
 */
exports.editEquipment = asyncHandler(async (req, res, next) => {
  const { name, icon } = req.body
  const id = req.params.id

  const { error } = createEquipmentValidation(req.body)
  if (error) return next(new ErrorReponse(error.details[0].message, 404))

  const existEquip = await Equipment.findById(id)

  if (existEquip.rowCount == 0) {
    return next(new ErrorReponse(`Equipment not found with id of ${id}`, 404))
  }

  const equip = new Equipment(
    id,
    name,
    icon,
  )

  const result = await equip.save()
  if (result) {
    res
      .status(200)
      .json({ success: true, data: result.rows[0].id })
  }
})


/**
 * @desc    Delete page
 * @route   DELETE /api/v1/equipment/:id
 * @access  Private
 */
exports.deleteEquipment = asyncHandler(async (req, res, next) => {
  const id = req.params.id

  const result = await Equipment.deleteById(id)
  if (result.rowCount === 0) {
    return next(new ErrorReponse(`Equipment not found with id of ${id}`, 404))
  }
  res.status(200).json({ success: true, data: id })
})
