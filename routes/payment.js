const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const VerifyToken = require("../middlewares/VerifyToken");
const TestSeries = require("../models/testseries");
const Course = require("../models/course");
const router = express.Router();
const Cart = require("../models/cart");
const calculatePricing = require("../middlewares/calculatePricing");
const TestSeriesEnrolments = require("../models/testSeriesEnrolments");
const Student = require("../models/student");
const CourseEnrollment = require("../models/courseEnrollments");
const TestSeriesEnrollment = require("../models/testSeriesEnrolments");

const EnrollStudent = require("../middlewares/EnrollStudent");
const checkEnrollment = require("../middlewares/checkEnrolment");
const fetchPrice = require("../middlewares/fetchPrice");

router
  .route("/orders")
  .post(VerifyToken, checkEnrollment, fetchPrice, async (req, res, next) => {
    try {
      const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_SECRET,
      });

      let cartCheck = {
        status: "INITIATED",
      };

      if (req.item.type === "Course") {
        cartCheck.course = req.item.id;
        value: req.price;
      } else if (req.item.type === "Test Series") {
        cartCheck.testSeries = req.item.id;
        value: req.price;
      }
      //Check if same cart had already been initiated
      Cart.findOne(cartCheck).then((foundCart) => {
        if (foundCart) {
          console.log(
            "[+] We found an existing cart - " +
              foundCart._id.toString() +
              " by this user for " +
              req.item.type
          );

          const options = {
            amount: req.price * 100,
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
            notes: { cart: foundCart._id.toString() },
          };

          instance.orders.create(options, (error, order) => {
            if (error) {
              console.log(error);
            }

            foundCart.order = order.id;
            foundCart.save();
            console.log("[+] New order sent - " + order.id);
            res.send(order);
          });
        } else {
          console.log("[+] Creating a new Cart");

          let newCart = {
            status: "INITIATED",
            testSeries: [],
            course: [],
            value: req.price,
          };

          if (req.item.type === "Course") {
            newCart.course.push(req.item.id);
          } else if (req.item.type === "Test Series") {
            newCart.testSeries.push(req.item.id);
          }

          new Cart(newCart).save().then((savedCart) => {
            console.log(savedCart._id.toString());
            const options = {
              amount: req.price * 100,
              currency: "INR",
              receipt: crypto.randomBytes(10).toString("hex"),
              notes: { cart: savedCart._id.toString() },
            };

            instance.orders.create(options, (error, order) => {
              if (error) {
                console.log(error);
              }

              savedCart.order = order.id;
              savedCart.save();
              console.log("[+] New order sent - " + order.id);
              res.send(order);
            });
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  });

router.post(
  "/verify",
  VerifyToken,
  async (req, res, next) => {
    try {
      console.log(req.body);
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(sign.toString())
        .digest("hex");

      if (razorpay_signature === expectedSign) {
        console.log("[+] Payment Verified Successfully");
        Cart.findOneAndUpdate(
          { order: razorpay_order_id },
          { status: "COMPLETED" },
          { new: true }
        )
          .then(async (cart) => {
            if (cart) {
              console.log("[+] Enrolling User");
              const courseEnrollments = [];
              const testSeriesEnrollments = [];

              for (const courseId of cart.course) {
                const enrollment = new CourseEnrollment({
                  student: req.student._id,
                  course: courseId,
                  join_date: new Date(),
                  last_date: new Date() + 365 * 24 * 60 * 60 * 1000, // 1 year from now
                });

                courseEnrollments.push(enrollment.save());
              }

              for (const testSeriesId of cart.testSeries) {
                const enrollment = new TestSeriesEnrollment({
                  student: req.student._id,
                  testseries: testSeriesId,
                  join_date: new Date(),
                  last_date: new Date() + 365 * 24 * 60 * 60 * 1000, // 1 year from now
                  cart: cart._id,
                });

                testSeriesEnrollments.push(enrollment.save());
              }
              console.log("[+] Successfully Enrolled");
              await Promise.all(courseEnrollments);
              await Promise.all(testSeriesEnrollments);

              cart.status = "FINISHED";
              await cart.save();
              console.log("[+] Cart Status Updated Successfully");
              return res.status(200).send({ message: "Payment successful." });
            }
          })
          .catch((err) => {
            res.status(500).json({ message: "Internal Server Error!" });
            console.log(error);
          });
      } else {
        return res.status(400).json({ message: "Invalid signature sent!" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error!" });
      console.log(error);
    }
  },
  EnrollStudent
);
module.exports = router;
