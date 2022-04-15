const Pages = require('../models/pages')
const _ = require('underscore')
const asyncHandler = require('../middleware/async')
const moment = require('moment')
const ErrorReponse = require('../utils/errorResponse')
const { createPagesValidation, updatePagesValidation } = require('../utils/validations')


/**
 * @desc   Get single pgae
 * @route   GET /api/v1/pages/:id
 * @access  Private
 */
exports.getPage= asyncHandler(async (req, res, next) => {
  if (!req.params.id) return next(new ErrorReponse('id is required', 400));
  const id = req.params.id

  const result = await Pages.findById(id)
  if (result.rowCount === 0) {
    res.status(204).json({ success: false,  message: `page not found with id of ${id}`})
  }else{
    res.status(200).json({ success: true, data: result.rows[0] })
  }  
})


/**
 * @desc   Get All page
 * @route   GET /api/v1/pages/
 * @access  Private
 */
exports.getPages= asyncHandler(async (req, res) => {

  const result = await Pages.getAll()
  if (result.rowCount === 0) {
    res.status(204).json({ success: false,  message: `Page is empty`})
  }else{
    res.status(200).json({ success: true, data: result.rows })
  }  
})

/**
 * @desc    Create page
 * @route   POST /api/v1/pages/
 * @access  Private
 */
exports.creatPage = asyncHandler(async (req, res, next) => {
  const {
    title,
    content
    } = req.body
  const { error } = createPagesValidation(req.body)
  
  if (error) res.status(204).json({ success: false, message: error.details[0].message })

  const page = new Pages(
    null,
    title,
    content,
  )
  const result = await page.save()
  if (result) {
    res
      .status(200)
      .json({ success: true, data: result.rows[0].id })
  } 
})


/**
 * @desc    Edit page
 * @route   PUT /api/v1/pages/:id
 * @access  Private
 */
exports.editPage = asyncHandler(async (req, res, next) => {
  const { content } = req.body
  const id = req.params.id

  const { error } = updatePagesValidation(req.body)
  if (error) return next(new ErrorReponse(error.details[0].message, 404))

  const existPage = await Pages.findById(id)

  if (existPage.rowCount == 0) {
    return next(new ErrorReponse(`Page not found with id of ${id}`, 404))
  }

  const page = new Pages(
    id,
    null,
    content,
  )

  const result = await page.save()
  if (result) {
    res
      .status(200)
      .json({ success: true, data: result.rows[0].id })
  }
})


/**
 * @desc    Delete page
 * @route   DELETE /api/v1/pages/:id
 * @access  Private
 */
exports.deletePage = asyncHandler(async (req, res, next) => {
  const id = req.params.id

  const result = await Pages.deleteById(id)
  if (result.rowCount === 0) {
    return next(new ErrorReponse(`Page not found with id of ${id}`, 404))
  }
  res.status(200).json({ success: true, data: id })
})
