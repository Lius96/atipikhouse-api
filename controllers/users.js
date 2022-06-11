const Users = require('../models/users')
const _ = require('underscore')
const asyncHandler = require('../middleware/async')
const moment = require('moment')
const ErrorReponse = require('../utils/errorResponse')
const { createUserValidation, updateUserValidation } = require('../utils/validations')
const { getHashedPassword, encodeString } = require('../utils/helpers')


/**
 * 
 * @desc   Get single user
 * @route   GET /api/v1/user/:id
 * @access  Private
 */
exports.getUser= asyncHandler(async (req, res, next) => {
  if (!req.params.id) return next(new ErrorReponse('id is required', 400));
  const id = req.params.id

  const result = await Users.findById(id)
  if (result.rowCount == 0) {
    res.status(200).json({ success: false,  message: `User not found with id of ${id}`})
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
  if (result.rowCount == 0) {
    res.status(200).json({ success: false,  message: `Users is empty}`})
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
    password,
    grade,
    city,
    country
    } = req.body
  const { error } = createUserValidation(req.body)
  
  if (error) return next(new ErrorReponse(error.details[0].message, 400))

  const existUser = await Users.findByEmail(email)
  if (existUser.rowCount > 0) {
    res
    .status(200)
    .json({ success: false, data: null, message: 'email already exist' })
    return;
  }

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
    encodeString(email),
    grade,
    city, 
    country
  )
  const result = await user.save()
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
  const { lastname, firstname, address, phone, social_link, grade, city, country } = req.body
  const id = req.params.id

  const { error } = updateUserValidation(req.body)
  if (error) return next(new ErrorReponse(error.details[0].message, 400))

  const existUser = await Users.findById(id)

  if (existUser.rowCount == 0) {
    return next(new ErrorReponse(`User not found with id of ${id}`, 404))
  }

  const user = new Users(
    id, lastname, firstname, null, address, phone, social_link, null, moment().unix(), null, null, grade, city, country
  )

  const result = await user.save()

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
    return next(new ErrorReponse(`User not found with id of ${id}`, 400))
  }
  const result = await Users.deleteById(id)
  if (result.rowCount === 0) {
    return next(new ErrorReponse(`User can be deleted for user id ${id}`, 404))
  }
  res.status(200).json({ success: true, data: id })
})

/**
 * @desc    update user password 
 * @route   PUT /api/v1/users/pass/:id
 * @access  Private
 */

 exports.updateUserPass = asyncHandler(async (req, res, next) => {
  const id = req.params.id

  const { password } = req.body

  if(_.isUndefined(password)) return next(new ErrorReponse(`password is required`, 400))

  const existUser = await Users.findById(id)

  if (existUser.rowCount == 0) {
    return next(new ErrorReponse(`User not found with id of ${id}`, 400))
  }

  const result = await Users.updatePass(id, getHashedPassword(password))
  if (!result) {
    return next(new ErrorReponse(`Cannot update password`, 404))
  }
  res.status(200).json({ success: true, data: id })
})

/**
 * @desc   Get single user
 * @route   POST /api/v1/user/pass
 * @access  Private
 */
 exports.getUserByEmail= asyncHandler(async (req, res, next) => {

  if(_.isUndefined(req.body.email)) return next(new ErrorReponse(`User not found with this email`, 400))

  const result = await Users.findByEmail(req.body.email)
  if (result.rowCount == 0) {
    res.status(200).json({ success: false,  message: `User not found with this email`})
  }else{
    res.status(200).json({ success: true, data: result.rows[0] })
  }  
})


/**
 * @desc   Get single user
 * @route   PUT /api/v1/user/confirmation/:id
 * @access  Private
 */
 exports.confirmedUser= asyncHandler(async (req, res, next) => {
  if (!req.params.token) return next(new ErrorReponse('token is required', 400));
  const user_token = req.params.token

  const result = await Users.findByToken(user_token)
  if (result.rowCount == 0) {
    res.status(200).json({ success: false,  message: `User not found with this token`})
  }else{
    const confirmed = await Users.updateConfirmation(result.rows[0].id)
    if (confirmed.rowCount !== 0) {
      res.status(200).json({ success: true, data: result.rows[0] })
    }else{
      res.status(200).json({ success: false,  message: `Confirmation not valid`})
    }
  }  
})
