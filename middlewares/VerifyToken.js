const auth = require("../config/firebase-config");
const Student = require("../models/student");

const VerifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodeValue = await auth.verifyIdToken(token);
    if (decodeValue) {
      req.user = decodeValue;
      Student.findOne({ uid: decodeValue.uid }).then((student) => {
        req.student = student;
        return next();
      });
    }
  } catch (e) {
    return res.json({ message: "Not Authenticated" });
  }
};

module.exports = VerifyToken;
