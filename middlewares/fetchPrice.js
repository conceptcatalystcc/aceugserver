const Course = require("../models/course");
const TestSeries = require("../models/testseries");

async function fetchPrice(req, res, next) {
  const item = req.item;
  let price = 0;

  try {
    // Fetch the price based on the item type from the database
    if (item.type === "Course") {
      const course = await Course.findById(item.id);
      price = course.price;
    } else if (item.type === "Test Series") {
      const testSeries = await TestSeries.findById(item.id);
      price = testSeries.price; // 20% tax
    }

    // Append the fetched price to req.price
    req.price = price;
    console.log("[+] Price of " + item.type + " is " + req.price + " - Next ");
    // Call the next middleware function
    next();
  } catch (err) {
    // Handle any errors
    console.error(err);
    res.status(500).send("Server Error");
  }
}

module.exports = fetchPrice;
