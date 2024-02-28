require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();

//DataBase Connection
require("./models/database.js").connectDatabase();

//Logger (tiny Data/small data)
const logger = require("morgan");
app.use(logger("tiny"));

//Configure CORS

//BodyParser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Session and Cookie
const session = require("express-session");
const cookieparser = require("cookie-parser");

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.EXPRESS_SESSION_SECRET,
  })
);

app.use(cookieparser());

//Express File Uploader

//Routes
app.use("/api/employee", require("./routes/employeeRoute.js"));

//Error Handling
const ErrorHandler = require("./utils/ErrorHandler.js");
const { generatedErrors } = require("./middlewares/error.js");
app.all("*", (req, res, next) => {
  next(new ErrorHandler(`Requested Url Not Found ${req.url}`, 404));
});
app.use(generatedErrors);

//Port
app.listen(
  process.env.PORT,
  console.log(`server Running on Port ${process.env.PORT}`)
);
