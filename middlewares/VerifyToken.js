const auth = require("../config/firebase-config");

const VerifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodeValue = await auth.verifyIdToken(token);
    if (decodeValue) {
      req.user = decodeValue;
      return next();
    }
  } catch (e) {
    return res.json({ message: "Internal Error" });
  }
};

module.exports = VerifyToken;
