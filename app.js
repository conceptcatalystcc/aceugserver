var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
var passport = require("passport");
const cors = require("cors");

const session = require("express-session");
const MongoStore = require("connect-mongo");

const Video = require("./models/video");
const Quiz = require("./models/quiz");
const Question = require("./models/question");
const Course = require("./models/course");
const Student = require("./models/student");
const Instructor = require("./models/instructor");
const Resource = require("./models/resources");
const Module = require("./models/modules");
const Blog = require("./models/blog");
const TestSeries = require("./models/testseries");
const CourseEnrollments = require("./models/courseEnrollments");
const Test = require("./models/test");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const courseRouter = require("./routes/course");
const progressRouter = require("./routes/progress");
const testSeriesRouter = require("./routes/testseries");
const studentRouter = require("./routes/student");
const courseprogressRouter = require("./routes/courseProgress");
const blogRouter = require("./routes/blog");
const paymentRouter = require("./routes/payment");

const AdminJS = require("adminjs");
const AdminJSExpress = require("@adminjs/express");
const AdminJSMongoose = require("@adminjs/mongoose");

const Connect = require("connect-pg-simple");

var app = express();

app.use(cors());

const DEFAULT_ADMIN = {
  email: "admin@example.com",
  password: "password",
};

const authenticate = async (email, password) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

require("./config/passportJWT")(passport);
app.use(passport.initialize());

const ConnectSession = Connect(session);
const sessionStore = new ConnectSession({
  conObject: {
    connectionString: process.env.POSTGRES_CONNECTION_STRING,
    ssl: process.env.NODE_ENV === "production",
  },
  tableName: "session",
  createTableIfMissing: true,
});

AdminJS.registerAdapter(AdminJSMongoose);

const pageResourceOptions = {
  properties: {
    material: {
      type: "richtext",
      custom: {
        modules: {
          toolbar: [
            ["bold", "italic"],
            ["link", "formula"],
          ],
        },
      },
    },
  },
};

const questionResourceOptions = {
  properties: {
    statement: {
      type: "richtext",
      custom: {
        modules: {
          toolbar: [
            ["bold", "italic"],
            ["link", "formula"],
          ],
        },
      },
    },
  },
};

const blogResourceOptions = {
  properties: {
    body: {
      type: "richtext",
      custom: {
        modules: {
          toolbar: [
            ["bold", "italic"],
            ["link", "formula"],
          ],
        },
      },
    },
  },
};

const importExportFeature = require("@adminjs/import-export").default;

const adminOptions = {
  // We pass Category to `resources`
  resources: [
    // {
    //   resource: Lesson,
    //   options: pageResourceOptions,
    //   features: [importExportFeature()],
    // },
    { resource: Video },
    { resource: Student },
    { resource: TestSeries },
    { resource: Course },
    { resource: Blog, options: blogResourceOptions },
    { resource: Instructor },
    { resource: Test },
    { resource: CourseEnrollments },
    { resource: Resource },
    { resource: Module },
    { resource: Quiz, features: [importExportFeature()] },
    {
      resource: Question,
      options: questionResourceOptions,
      features: [importExportFeature()],
    },
  ],
};

const admin = new AdminJS(adminOptions);

const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  admin,
  {
    authenticate,
    cookieName: "adminjs",
    cookiePassword: "sessionsecret",
  },
  null,
  {
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
    secret: "sessionsecret",
    cookie: {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
    },
    name: "adminjs",
  }
);
app.use(admin.options.rootPath, adminRouter);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

mongoose.set("strictQuery", true);
const url = process.env.MONGO_DB_URL;
const connect = mongoose.connect(url);

connect.then(
  (db) => {
    console.log("Connected Successfully to the server");
  },
  (err) => console.log(err)
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
    store: MongoStore.create({
      mongoUrl: "mongodb+srv://test:test@cluster0.rkd2v8q.mongodb.net",
      dbName: "aceugA",
      collectionName: "sessions",
    }),
  })
);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/courses", courseRouter);
app.use("/progress", progressRouter);
app.use("/course-progress", courseprogressRouter);
app.use("/testseries", testSeriesRouter);
app.use("/student", studentRouter);
app.use("/blogs", blogRouter);
app.use("/payment", paymentRouter);

module.exports = app;
