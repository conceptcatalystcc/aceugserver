const auth = require("../config/firebase-config");
const Student = require("../models/student");

const VerifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodeValue = await auth.verifyIdToken(token);
    if (decodeValue) {
      req.user = decodeValue;
      Student.findOne({ uid: decodeValue.uid }).then((student) => {
        if (student) {
          req.student = student;
          console.log("[+] Valid User - Next");
          return next();
        } else {
          return res.json({ message: "Student Not Exist" });
        }
      });
    }
  } catch (e) {
    return res.json({ message: "Not Authenticated" });
  }
};

module.exports = VerifyToken;
