const { body, validationResult } = require("express-validator");
const {
  errorUserMessages,
  errorProjectMessages,
  errorIssueMessages,
  errorTaskMessages,
  errorSprintMessages,
  errorReleaseMessages
} = require("../util/constants");

const issueRepo = require("../repositories/issue.repository");

module.exports.userValidations = [
  body("email")
    .isEmail()
    .withMessage(errorUserMessages.email.valid),
  body("password")
    .isLength({ min: 8 })
    .withMessage(errorUserMessages.password.min)
    .isLength({ max: 32 })
    .withMessage(errorUserMessages.password.max)
    .matches(/\d/) // must contain at least one number
    .withMessage(errorUserMessages.password.number)
    .matches(/[a-z]/) // must contain at least one lowercase char
    .withMessage(errorUserMessages.password.lower)
    .matches(/[A-Z]/) // must contain at least one uppercase char
    .withMessage(errorUserMessages.password.upper),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error(errorUserMessages.confirmPassword.same);
    }
    return true;
  }),
  body("username")
    .isLength({ min: 4 })
    .withMessage(errorUserMessages.username.min)
    .isLength({ max: 20 })
    .withMessage(errorUserMessages.username.max)
];

module.exports.projectValidations = [
  body("title")
    .not()
    .isEmpty()
    .withMessage(errorProjectMessages.title.empty)
    .isLength({ max: 128 })
    .withMessage(errorProjectMessages.title.max),
  body("dueDate")
    .optional({ checkFalsy: true })
    .matches(/^\d{2}\/\d{2}\/\d{4}$/)
    .withMessage(errorProjectMessages.dueDate.format),
  body("description")
    .optional({ checkFalsy: true })
    .isLength({ max: 3000 })
    .withMessage(errorProjectMessages.description.max)
];

module.exports.issueValidations = [
  body("userType")
    .not()
    .isEmpty()
    .withMessage(errorIssueMessages.userType.empty)
    .isLength({ max: 1000 })
    .withMessage(errorIssueMessages.userType.max),
  body("userGoal")
    .not()
    .isEmpty()
    .withMessage(errorIssueMessages.userGoal.empty)
    .isLength({ max: 1000 })
    .withMessage(errorIssueMessages.userGoal.max),
  body("userReason")
    .not()
    .isEmpty()
    .withMessage(errorIssueMessages.userReason.empty)
    .isLength({ max: 1000 })
    .withMessage(errorIssueMessages.userReason.max),
  body("storyId")
    .not()
    .isEmpty()
    .withMessage(errorIssueMessages.storyId.empty)
    .isLength({ max: 20 })
    .withMessage(errorIssueMessages.storyId.max)
    .custom((value, { req }) => {
      const { projectId } = req.params;
      const { issueId } = req.params;
      return issueRepo.isUniqueStoryId(projectId, issueId, value).then(result => {
        if (!result) {
          return Promise.reject(errorIssueMessages.storyId.unique);
        }
        return null;
      });
    }),
  body("difficulty")
    .not()
    .isEmpty()
    .withMessage(errorIssueMessages.difficulty.empty)
    .isInt({ min: 1 })
    .withMessage(errorIssueMessages.difficulty.min)
];

module.exports.roleValidation = [
  body("role")
    .matches(/^(pm|user)$/)
    .withMessage(errorProjectMessages.role.values)
];

module.exports.taskValidations = [
  body("cost")
    .not()
    .isEmpty()
    .withMessage(errorTaskMessages.cost.empty)
    .isFloat({ min: 0.5 })
    .withMessage(errorTaskMessages.cost.min),
  body("description")
    .not()
    .isEmpty()
    .withMessage(errorTaskMessages.description.empty)
    .isLength({ max: 3000 })
    .withMessage(errorTaskMessages.description.max),
  body("definitionOfDone")
    .not()
    .isEmpty()
    .withMessage(errorTaskMessages.definitionOfDone.empty)
    .isLength({ max: 3000 })
    .withMessage(errorTaskMessages.definitionOfDone.max)
];

module.exports.taskStateValidation = [
  body("state")
    .matches(/^(TODO|DOING|DONE|TOTEST|TESTING|TESTED)$/)
    .withMessage(errorTaskMessages.state.match)
];

module.exports.sprintValidations = [
  body("id")
    .not()
    .isEmpty()
    .withMessage(errorSprintMessages.id.empty)
    .isLength({ max: 20 })
    .withMessage(errorSprintMessages.id.max),
  body("startDate")
    .matches(/^\d{2}\/\d{2}\/\d{4}$/)
    .withMessage(errorSprintMessages.startDate.format),
  body("endDate")
    .matches(/^\d{2}\/\d{2}\/\d{4}$/)
    .withMessage(errorSprintMessages.endDate.format),
  body("description")
    .optional({ checkFalsy: true })
    .isLength({ max: 3000 })
    .withMessage(errorSprintMessages.description.max)
];

module.exports.releaseValidations = [
  body("version")
    .not()
    .isEmpty()
    .withMessage(errorReleaseMessages.version.empty)
    .isLength({ max: 20 })
    .withMessage(errorReleaseMessages.version.max),
  body("description")
    .optional({ checkFalsy: true })
    .isLength({ max: 3000 })
    .withMessage(errorReleaseMessages.description.max)
];

/**
 * a middleware to validate the request using the provided validators
 * if there are errors, returns a list of errors with 442 HTTP Code else it executes
 * the next middleware.
 */
module.exports.validate = (req, res, next) => {
  req.validation = { success: true };
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = [];
    errors.array().forEach(e => errorMessages.push({ [e.param]: e.msg }));
    req.validation = { success: false, errors: errorMessages };
  }
  next();
};
