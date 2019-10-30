const { body, validationResult } = require("express-validator");
const errors = require("../constants").errorMessages;

const userValidations = [
  // username must be an email
  body('username').isEmail(),
  // password must be at least 5 chars long
  body('password').isLength({ min: 5 }),
];

const validate = (res, req, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  userValidations,
  validate
};
