const express = require("express");

const Blog = require("../models/blog");

const blogRouter = express.Router();
const blogPerPage = 10;

const mongoose = require("mongoose");

blogRouter.route("/:page").get((req, res, next) => {
  const page = req.params.page;

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

  Blog.findOne({ title: title })
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
