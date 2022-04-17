const { loginValidation, logoutValidation } = require("../utils/validations");
const Login = require("../models/login");
const ErrorReponse = require('../utils/errorResponse')
const moment = require("moment");
const {
  verifyPass,
  updateLoginHistory,
  generateWord,
} = require("../utils/helpers");
const _ = require("underscore");

/**
 *
 * @access Private
 * @route POST api/v1/login/
 * @return object
 */
exports.login = async (req, res, next) => {
  const { error } = loginValidation(req.body);
  if (error) return next(new ErrorReponse(error.details[0].message, 400));
  let account = await Login.findByEmail(req.body.email)
  if (account.rowCount == 0) {
    res.status(200).json({ success: false, message: "Bad credential" });
    return;
  }
  if (!verifyPass(req.body.password, account.rows[0].password)) {
    res.status(200).json({ success: false, message: "Bad credential" });
    return;
  }
  const nowTime = moment().unix();
  const loginToken = generateWord(18);
  const login = new Login(
    account.rows[0].email,
    account.rows[0].id,
    updateLoginHistory(account.rows[0].login_history, nowTime),
    nowTime,
    loginToken
  );

  const result = await login.add();
  if (result) {
    let user = await Login.find(result.rows[0].id);

    if (user) {
      res.status(200).json({ success: true, data: await user.rows[0] });
    }
  }
};

/**
 * @desc remove user sessionToken
 * @access Private
 * @return object
 * @route DELETE api/v1/login/
 */
exports.logout = async (req, res, next) => {
  const { error } = logoutValidation(req.params);
  if (error) return next(new ErrorReponse(error.details[0].message, 400));

  const login = new Login(null, req.params.id);

  const result = await login.delete().catch(err =>{
    next(err)
  })

  res.status(200).json({
    success: true,
    data: result.rows[0].id,
  });
};
