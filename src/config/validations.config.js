const { body, validationResult } = require("express-validator");
const errors = require("../constants").errorMessages;

module.exports.userValidations = [
  body("email")
    .isEmail()
    .withMessage(errors.email.valid),
  body("password")
    .isLength({ min: 8 })
    .withMessage(errors.password.min)
    .isLength({ max: 32 })
    .withMessage(errors.password.max)
    .matches(/\d/) // must contain at least one number
    .withMessage(errors.password.number)
    .matches(/[a-z]/) // must contain at least one lowercase char
    .withMessage(errors.password.lower)
    .matches(/[A-Z]/) // must contain at least one uppercase char
    .withMessage(errors.password.upper),
  body("username")
    .isLength({ min: 4 })
    .withMessage(errors.username.min)
    .isLength({ max: 20 })
    .withMessage(errors.username.max)
];

/**
 * a middleware to validate the request using the provided validators
 * if there are errors, returns a list of errors with 442 HTTP Code else it executes
 * the next middleware.
 */
module.exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = [];
    errors.array().forEach(e => errorMessages.push({ [e.param]: e.msg }));
    return res.status(422).json({ success: false, errors: errorMessages });
  }
  next();
};
