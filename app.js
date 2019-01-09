const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require("path");

const app = express();

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api", require("./api"));

app.use(express.static("public"));
// app.use(express.static(path.join(__dirname, "build")));

// app.get("/*", function(req, res) {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });

app.get("*", (req, res) => {
  res.sendFile(path.resolve("public", "index.html"));
});

app.use(require("./utils/errorHandler"));

module.exports = app;
