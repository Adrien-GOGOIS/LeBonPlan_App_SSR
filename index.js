const express = require("express");
const app = express();
const path = require("path");

const handlebars = require("express-handlebars");

// Middleware
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));

// handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  res.render("homepage");
});

app.get("/users", (req, res) => {
  res.render("users");
});

app.get("/products", (req, res) => {
  res.render("products");
});

app.listen(8000, () => console.log("Listen on port 8000"));
