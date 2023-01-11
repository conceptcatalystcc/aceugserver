const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const VerifyToken = require("../middlewares/VerifyToken");
const TestSeries = require("../models/testseries");
const Course = require("../models/course");
const router = express.Router();
const Cart = require("../models/cart");
const calculatePricing = require("../middlewares/calculatePricing");

function getPrice(item) {
  return new Promise((resolve, reject) => {
    TestSeries.findById(item.id).then((testSeries) => {
      console.log(testSeries.name + " --- " + testSeries.price);
      resolve(testSeries.price);
    });
  });
}

router.route("/orders").post(calculatePricing, async (req, res, next) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const cart = new Cart(req.cart).save().then((savedCart) => {
      console.log("Creating an Order");
      console.log(savedCart._id.toString());
      const options = {
        amount: req.cart.value * 100,
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
        res.send(order);
      });
    });
  } catch (error) {}
});

const enrollUser = (testSeriesId) => {
  console.log("Enrolling User" + testSeriesId);
};

router.post("/verify", async (req, res) => {
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
      Cart.findOneAndUpdate(
        { order: razorpay_order_id },
        { status: "COMPLETED" },
        { new: true }
      )
        .then((cart) => {
          if (cart) {
            cart.testSeries.map((testSeriesId) => {
              enrollUser(testSeriesId);
            });
          }
        })
        .then(() => {
          return res
            .status(200)
            .json({ message: "Payment verified successfully" });
        });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
    console.log(error);
  }
});
module.exports = router;
