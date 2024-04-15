const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const asyncHandler = require("../middleware/async");
const ErrorReponse = require("../utils/errorResponse");
const { sendMailValidation } = require("../utils/validations");
const axios = require("axios");

const transporter = nodemailer.createTransport(
  smtpTransport({
    host: process.env.MAILHOST,
    port: 587,
    auth: {
      user: process.env.MAILUSER,
      pass: process.env.MAILPASS,
    },
    tls: {
      rejectUnauthorized: process.env.ENV == "production" ? true : false,
    },
  })
);

/**
 * @desc   send mail
 * @route   POST /api/v1/mail/
 * @access  Private
 */
exports.sendMail = asyncHandler(async (req, res, next) => {
  const { from, to, subject, body } = req.body;
  const { error } = sendMailValidation(req.body);
  if (error) return next(new ErrorReponse(error.details[0].message, 404));
  var mailOptions = {
    from: from
      ? from + "<atypikhouse@f2i-dev26-jd.fr>"
      : "No-reply <atypikhouse@f2i-dev26-jd.fr>",
    to,
    subject,
    text: body,
  };
  transporter.sendMail(mailOptions, function (error) {
    if (error) {
      console.log(error);
      res.status(200).json({ success: false, data: null });
    } else {
      res.status(200).json({ success: true, data: null });
    }
  });
});

/**
 * @desc   send recpatcha token
 * @route   POST /api/v1/mail/recaptcha/
 * @access  Private
 */
exports.getRecaptcha = asyncHandler(async (req, res, next) => {
  const { response } = req.params;
  const verifiedStatus = await axios.get(
    `https://www.google.com/recaptcha/api/siteverify`,
    {
      params: {
        secret: process.env.RECPATCHA_SK,
        response: response,
      },
      headers: {
        withCredentials: false,
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
  res.status(200).json(verifiedStatus);
});
