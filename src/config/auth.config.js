/**
 * auth config module
 * @module config/auth
 */

/**
 * middleware that checks if the user is logged in
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
module.exports.isAuth = (req, res, next) => {
  if (!req.session.user) {
    req.session.url = req.originalUrl;
    return res.status(401).redirect('/login');
  }
  return next();
};

/**
 * middleware that checks if the user is not logged in
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
module.exports.isNotAuth = (req, res, next) => {
  if (req.session.user)
    return res.status(401).redirect('/');
  return next();
};
