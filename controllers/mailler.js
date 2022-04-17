const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const asyncHandler = require('../middleware/async')
const ErrorReponse = require('../utils/errorResponse')
const { sendMailValidation } = require('../utils/validations')


const transporter = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: process.env.MAILUSER,
      pass: process.env.MAILPASS,
    },
  })
);

/**
 * @desc   send mail
 * @route   POST /api/v1/mail/
 * @access  Private
 */
exports.sendMail = asyncHandler(async (req, res, next) => {
  const { from, to, subject, body } = req.body
  const { error } = sendMailValidation(req.body)
  if (error) return next(new ErrorReponse(error.details[0].message, 404))
  var mailOptions = {
    from,
    to,
    subject,
    text: body,
  };
  transporter.sendMail(mailOptions, function(error){
    if (error) {
      console.log(error)
        res.status(200).json({ success: false, data: null });
    } else {
        res.status(200).json({ success: true, data: null });
    }
  });  
  
});
