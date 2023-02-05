const TestSeries = require("../models/testseries");

const fetchOne = (item) => {
  return new Promise((resolve, reject) => {
    TestSeries.findById(item.id).then((testSeries) => {
      resolve(testSeries);
    });
  });
};

const fetching = (items) => {
  return new Promise(async (resolve, reject) => {
    try {
      var cartValue = 0;
      console.log(items);
      for (i = 0; i < items.length; i++) {
        console.log("Mapping items");
        const testSeries = await fetchOne(items[i]);
        cartValue = cartValue + testSeries.price;
      }

      if (i === items.length) {
        resolve(cartValue);
      }
    } catch (error) {}
  });
};

const calculatePricing = async (req, res, next) => {
  try {
    const items = req.body.items;
    console.log("RUnning Middleware");

    fetching(items).then((cartValue) => {
      console.log("Fetched");

      const cart = {
        testSeries: items
          .filter((item) => item.type === "Test Series")
          .map((item) => item.id),
        course: items
          .filter((item) => item.type === "Course")
          .map((item) => item.id),
        value: cartValue,
      };
      req.cart = cart;

      console.log("Next Middleware");
      return next();
    });
  } catch (e) {
    return res.json({ message: "Error in Calculating Price " });
  }
};

module.exports = calculatePricing;
