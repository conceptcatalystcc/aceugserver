const auth = require("../config/firebase-config");
const Student = require("../models/student");
const TestSeriesEnrollment = require("../models/testSeriesEnrolments");
const TestSeries = require("../models/testseries");
const mongoose = require("mongoose");

const enroll = (studentId, testSeriesId, cartId) => {
  return new Promise((resolve, reject) => {
    console.log("Enrolling");

    TestSeriesEnrollment.findOne({
      student: studentId,
      testseries: testSeriesId,
    }).then((foundEnrollment) => {
      if (foundEnrollment) {
        console.log("Already Enrolled");
        resolve(foundEnrollment);
      } else {
        //Enroll Student
        //validating if Test Series Exist
        TestSeries.findById(testSeriesId)
          .then((testSeries) => {
            //Checking if student exists
            Student.findById(studentId)
              .then((student) => {
                //Creating a Test Series Enrollment

                var join_date = new Date();
                var last_date = new Date();
                last_date.setDate(join_date.getDate() + testSeries.days);
                const newEnrollment = {
                  testseries: mongoose.Types.ObjectId(testSeriesId),
                  student: mongoose.Types.ObjectId(studentId),
                  cart: mongoose.Types.ObjectId(cartId),
                  join_date: join_date,
                  last_date: last_date,
                  test_progress: [],
                };

                new TestSeriesEnrollment(newEnrollment)
                  .save()
                  .then((data) => {
                    //Adding Test Series to Student
                    student.series_enrolled.push(testSeriesId);
                    student.save().then(() => {
                      resolve(newEnrollment);
                    });
                  })
                  .catch((err) => {
                    reject(err);
                  });
              })
              .catch((err) => {
                reject(err);
              });
          })
          .catch((err) => {
            reject(err);
          });
      }
    });
  });
};

const enrolling = (items) => {
  return new Promise(async (resolve, reject) => {
    try {
      for (i = 0; i < items.length; i++) {
        const testSeriesId = items[i];
        const studentId = req.student._id;
        console.log("Enrolled in 1 Test Series");
        /*    enroll(studentId, testSeriesId).then(() => {
          console.log("Enrolled in 1 Test Series");
        }); */
      }

      if (i === items.length) {
        resolve();
      }
    } catch (error) {}
  });
};

const EnrollStudent = async (req, res, next) => {
  try {
    const cart = req.cart;
    console.log(cart);
    if (cart.status === "COMPLETED") {
      const testSeriesId = cart.testSeries[0];
      const studentId = req.student._id;

      let allPs = [];
      cart.testSeries.map((series) => {
        const p1 = enroll(studentId, testSeriesId, cart._id);
        allPs.push(p1);
      });

      Promise.all(allPs).then(() => {
        console.log("All Promises Resolved");
        res.send("Payment Verified Successfully");
      });
    }
  } catch (e) {
    return res.json({ message: "Internal Error" });
  }
};

module.exports = EnrollStudent;
