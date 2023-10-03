const jwt = require("jsonwebtoken");

function validateToken(req, res, next) {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, process.env.jwt_secret, (error, payload) => {
      if (error) {
        return res.status(401).json({ error: "Unauthorized: invalid token" });
      }
      req.user = payload;
      next();
    });
  } else {
    return res.status(401).json({ error: "Unauthorized: no token provided" });
  }
}

module.exports = validateToken;
