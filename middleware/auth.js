const asyncHander = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const _ = require('underscore')
const pool = require("../config/db")
// Protect routes
exports.protect = asyncHander(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization 
  ) {
    token = req.headers.authorization;
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse("Not authorize to access this route", 401));
  }

  try {
    // Verify token
   
    const result = await pool.query("SELECT * FROM users WHERE login_session_token=$1", [
      token
    ]);
    
    if (result.rowsCount === 0) return next(new ErrorResponse("Not authorize to access this route", 401));
    req.user = result.rows[0];
    next();
  } catch (err) {
    return next(new ErrorResponse("Not authorize to access this route", 401));
  }
});




