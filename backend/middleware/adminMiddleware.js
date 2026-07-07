const jwt = require("jsonwebtoken");

const adminMiddleware = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token, access denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    req.user = decoded;
    next();

  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = adminMiddleware;