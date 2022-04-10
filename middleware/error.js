const ErrorResponse = require("../utils/errorResponse");

const error = (error, req, res, next) => {
  console.log(error);
  res.status(error.statusCode || 201).json({
    success: false,
    error: error.messageWithField || error.message || "Server Error"
  });
};

module.exports = error;
