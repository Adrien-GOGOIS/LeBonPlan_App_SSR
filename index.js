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

app.get("/profile", (req, res) => {
  res.render("profile");
});

app.get("/users", (req, res) => {
  res.render("users");
});

app.get("/products", (req, res) => {
  res.render("products");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/login", (req, res) => {
  res.redirect("/profile");
});

app.post("/signup", (req, res) => {
  res.redirect("/");
});

app.listen(8000, () => console.log("Listen on port 8000"));
