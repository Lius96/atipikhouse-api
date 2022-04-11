const Comments = require('../models/comments')
const _ = require('underscore')
const asyncHandler = require('../middleware/async')
const moment = require('moment')
const ErrorReponse = require('../utils/errorResponse')
const { createCommentsValidation, updateCommentsValidation } = require('../utils/validations')


/**
 * @desc   Get All comments
 * @route   GET /api/v1/comments/
 * @access  Private
 */
exports.getComments= asyncHandler(async (req, res) => {

  const result = await Comments.getAll()
  if (result.rowCount === 0) {
    res.status(204).json({ success: false,  message: `Comments is empty`})
  }else{
    res.status(200).json({ success: true, data: result.rows })
  }  
})


/**
 * @desc   Get All comments by house
 * @route   GET /api/v1/comments/house/:id
 * @access  Private
 */
exports.getHouseComments= asyncHandler(async (req, res) => {
  if (!req.params.id) res.status(204).json({ success: false, message: 'id is required' });
  const id = req.params.id;
  const result = await Comments.findByHouse(id)
  if (result.rowCount === 0) {
    res.status(204).json({ success: false,  message: `comments is empty for house ${id}`})
  }else{
    res.status(200).json({ success: true, data: result.rows })
  }  
})

/**
 * @desc    Create comments
 * @route   POST /api/v1/comments/
 * @access  Private
 */
exports.createComments = asyncHandler(async (req, res, next) => {
  const {
    content,
    status,
    stars_number,
    house,
    user_id,
    } = req.body
  const { error } = createCommentsValidation(req.body)
  
  if (error) res.status(204).json({ success: false, message: error.details[0].message })

  const comment = new Comments(
    null,
    content,
    user_id,
    moment().unix(),
    status,
    stars_number,
    house,
  )
  const result = await comment.save().catch(err => {
    next(err)
  })
  if (result) {
    res
      .status(200)
      .json({ success: true, data: result.rows[0].id })
  } 
})


/**
 * @desc    Edit Comments
 * @route   PUT /api/v1/comments/:id
 * @access  Private
 */
exports.editComment = asyncHandler(async (req, res, next) => {
  const { content,
    status,
    stars_number, } = req.body
  const id = req.params.id

  const { error } = updateCommentsValidation(req.body)
  if (error) return next(new ErrorReponse(error.details[0].message, 404))

  const existcomment = await Comments.findById(id)

  if (existcomment.rowCount == 0) {
    return next(new ErrorReponse(`Comments not found with id of ${id}`, 404))
  }

  const comment = new Comments(
    id,
    content,
    null,
    null,
    status,
    stars_number,
    null
  )

  const result = await comment.save().catch(err => {
      next(err)
  })

  if (result) {
    res
      .status(200)
      .json({ success: true, data: result.rows[0].id })
  }
})


/**
 * @desc    Delete comment
 * @route   DELETE /api/v1/comments/:id
 * @access  Private
 */
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const id = req.params.id

  const result = await Comments.deleteById(id)
  if (result.rowCount === 0) {
    return next(new ErrorReponse(`Comment not found with id of ${id}`, 404))
  }
  res.status(200).json({ success: true, data: id })
})
