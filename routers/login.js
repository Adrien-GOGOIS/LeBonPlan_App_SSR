const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");

const handlebars = require("express-handlebars");

// handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");

// MIDDLEWARES
app.use(express.json());

router.get("/", (req, res) => {
  res.render("login");
});

router.post("/", (req, res) => {
  res.redirect("profile");
});

module.exports = router;
