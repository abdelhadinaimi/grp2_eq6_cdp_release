const jwt = require("jsonwebtoken");

module.exports.verifyJWT = (req, res, next) => {
  if (!req.cookies.token) {
    return res.status(401).end();
  }
  jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).end();
    }
    req.user = payload;
    next();
  });
};

module.exports.logout = userId => {};
