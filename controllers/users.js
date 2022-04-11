const Users = require('../models/users')
const _ = require('underscore')
const asyncHandler = require('../middleware/async')
const moment = require('moment')
const ErrorReponse = require('../utils/errorResponse')
const { createUserValidation, updateUserValidation } = require('../utils/validations')
const { getHashedPassword, encodeString } = require('../utils/helpers')


/**
 * @desc   Get single user
 * @route   GET /api/v1/user/:id
 * @access  Private
 */
exports.getUser= asyncHandler(async (req, res, next) => {
  const id = req.params.id

  const result = await Users.findById(id)
  if (result.rowCount === 0) {
    res.status(204).json({ success: false,  message: `User not found with id of ${id}`})
  }else{
    res.status(200).json({ success: true, data: result.rows[0] })
  }  
})


/**
 * @desc   Get All users
 * @route   GET /api/v1/user/
 * @access  Private
 */
exports.getUsers= asyncHandler(async (req, res, next) => {

  const result = await Users.getAll()
  if (result.rowCount === 0) {
    res.status(204).json({ success: false,  message: `Users is empty}`})
  }else{
    res.status(200).json({ success: true, data: result.rows })
  }  
})

/**
 * @desc    Create user
 * @route   POST /api/v1/user/
 * @access  Private
 */
exports.creatUser = asyncHandler(async (req, res, next) => {
  const { lastname,
    firstname,
    address,
    email,
    phone,
    social_link,
    password
    } = req.body
  const { error } = createUserValidation(req.body)
  
  if (error) res.status(204).json({ success: false, message: error.details[0].message })

  const user = new Users(
    null,
    lastname,
    firstname,
    email,
    address,
    phone,
    social_link,
    moment().unix(),
    null,
    getHashedPassword(password),
    encodeString(email)
  )
  const result = await user.save().catch(err => {
    next(err)
  })
  if (result) {
    res
      .status(200)
      .json({ success: true, data: result.rows[0].id })
  } 
})


/**
 * @desc    Edit User
 * @route   PUT /api/v1/user/:id
 * @access  Private
 */
exports.editUser = asyncHandler(async (req, res, next) => {
  const { lastname, firstname, address, phone, social_link } = req.body
  const id = req.params.id

  const { error } = updateUserValidation(req.body)
  if (error) return next(new ErrorReponse(error.details[0].message, 404))

  const existUser = await Users.findById(id)

  if (existUser.rowCount == 0) {
    return next(new ErrorReponse(`User not found with id of ${id}`, 404))
  }

  const user = new Users(
    id, lastname, firstname, null, address, phone, social_link, null, moment().unix() 
  )

  const result = await user.save().catch(err => {
      next(err)
  })

  if (result) {
    res
      .status(200)
      .json({ success: true, data: result.rows[0].id })
  }
})


/**
 * @desc    Delete user
 * @route   DELETE /api/v1/user/:id
 * @access  Private
 */
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const id = req.params.id

  const existUser = await Users.findById(id)

  if (existUser.rowCount == 0) {
    return next(new ErrorReponse(`User not found with id of ${id}`, 404))
  }
  const result = await Users.deleteById(id)
  if (result.rowCount === 0) {
    return next(new ErrorReponse(`User not found with id of ${id}`, 404))
  }
  res.status(200).json({ success: true, data: id })
})
