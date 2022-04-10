const { loginValidation,  } = require('../utils/validations')
const Login = require('../models/login')
const moment = require('moment')
const { verifyPass, updateLoginHistory, generateWord } = require("../utils/helpers");
const _ = require('underscore');


/**
 *  
 * @access Private
 * @route POST api/v1/login/
 * @return object
 */
exports.login = async(req, res, next) => {

    const {error} = loginValidation(req.body)

    if (error) res.status(204).json({ success: false, message: error.details[0].message })
    let account = await Login.findByEmail(req.body.logoutValidationemail)
    if(account.rowCount === 0) res.status(204).json({ success: false, message: 'Bad credential' })
    if(verifyPass(req.body.password, account.rows[0].password)) res.status(204).json({ success: false, message: 'Bad credential' })
    const nowTime = moment().unix();
    const loginToken = generateWord(18);
    const login = new Login(
        account.rows[0].email,
        account.rows[0].id,
        updateLoginHistory(account.rows[0].login_history, nowTime),
        nowTime,
        loginToken
    ) 
    
    const result = await login.add().catch(err => {
        next(err)
    })

    if (result) {
        let user = await login.find().catch(err => {
            next(err)
        })
        res
          .status(200)
          .json({ success: true, data: user })
    }
    
}

/**
 * @desc remove user sessionToken
 * @access Private
 * @return object
 * @route DELETE api/v1/login/
 */
exports.logout = async (req, res, next) => {

    const {error} = logoutValidation(req.body)
    if (error) res.status(204).json({ success: false, message: error.details[0].message })

    const login = new Login(
        null,
        req.body.id,
    )

    const result = await login.delete().catch(err => {
        next(err)
    })

    res.status(200).json({
        success: true,
        data: result.rows[0]
    })
}