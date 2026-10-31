const jwt = require("jsonwebtoken");
const { getJwtSecret } = require("../config/jwt");

function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    if (decoded.type && decoded.type !== "access") {
      return res.status(401).json({ message: "Not authorized, invalid token type." });
    }
    req.userId = decoded.id;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired.", code: "TOKEN_EXPIRED" });
    }
    return res.status(401).json({ message: "Not authorized, invalid token." });
  }
}

module.exports = protect;
