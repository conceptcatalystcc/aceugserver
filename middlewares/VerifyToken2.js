const auth = require("../config/firebase-config");
const Student = require("../models/student");

const VerifyToken2 = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodeValue = await auth.verifyIdToken(token);
    if (decodeValue) {
      req.user = decodeValue;

      // Remove the +91 country code from the phone number in the decoded token
      const decodedPhoneNumber = decodeValue.phone_number.replace("+91", "");

      Student.findOne({ phone: decodedPhoneNumber }).then(async (student) => {
        if (student) {
          // Check if student.uid is not set, then set it from decoded token
          if (!student.uid) {
            student.uid = decodeValue.uid;
            await student.save();
          }
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

module.exports = VerifyToken2;
