const express = require("express");

const Blog = require("../models/blog");

const blogRouter = express.Router();
const blogPerPage = 10;

const mongoose = require("mongoose");

blogRouter.route("/").get((req, res, next) => {
  const page = req.query.page;

  Blog.find()
    .skip(page * blogPerPage)
    .limit(blogPerPage)
    .then(
      (blogs) => {
        res.status = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(blogs);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

blogRouter.route("/blog/:title").get((req, res, next) => {
  const title = req.params.title;
  console.log(decodeURIComponent(title));
  Blog.findOne({ title: decodeURIComponent(title) })
    .then(
      (blog) => {
        res.status = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(blog);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

module.exports = blogRouter;
