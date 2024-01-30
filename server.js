require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const corsOptions = require("./config/corsOption");
const PORT = process.env.PORT || 3500;

const jwt = require("./middleware/verifyJWT");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credential");

const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");

//connect to DB
connectDB();

//custom middleware logger
app.use(logger);

//handle options credentials check - before CORS
//and fetch cookies credentials requirements
app.use(credentials);

//Cross Origin Resource Sharing
app.use(cors(corsOptions));

//built-in middleware to handle urlencoded data
//in other words, form data:
// 'content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

//built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files (for the css,images, texts)
app.use(express.static(path.join(__dirname, "/public")));

//for the sub directory
//routes will redirect to the path in the require
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

app.use(verifyJWT); //will protect route below
app.use("/employees", require("./routes/api/employees"));
app.use("/users", require("./routes/api/users"));

//all -> used for routing, applies to all http methods
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
