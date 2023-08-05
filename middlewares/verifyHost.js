// verifyHostMiddleware.js
const Student = require("../models/student");

async function verifyHost(req, res, next) {
  console.log("[+] Request from", req.hostname);
  try {
    const uid = req.user.uid; // Assuming req.user.uid contains the distributor ID of the student

    // Search for the student based on the uid and populate the distributor field
    const student = await Student.findOne({ uid: uid }).populate("distributor");

    if (!student) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const studentDistributorDomain = student.distributor.domain;
    const requestHostname = req.hostname;

    if (studentDistributorDomain === requestHostname) {
      // Distributor domain matches request hostname
      return next();
    } else {
      return res.status(403).json({ error: "Forbidden" });
    }
  } catch (err) {
    console.error("Error verifying host:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = verifyHost;
