const express = require("express");
const app = express();
const router = express.Router();

// MIDDLEWARES
app.use(express.json());

router.get("/profile", (req, res) => {
  res.render("profile");
});

router.get("/", (req, res) => {
  res.render("users");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/login", (req, res) => {
  res.redirect("/profile");
});

router.post("/signup", (req, res) => {
  res.redirect("/");
});

module.exports = router;
