const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
const verifySalesToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  try {
    const decoded = jwt.verify(token, "HEYSHHHHHHHHHHHHH"); // Replace with your secret key
    req.userId = decoded.userId; // Store the user ID in the request
    next(); // Move to the next middleware
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = verifySalesToken;
