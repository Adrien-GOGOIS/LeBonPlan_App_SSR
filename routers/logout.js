const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
const router = express.Router();

// Dotenv
const dotenv = require("dotenv");
dotenv.config({
  path: "../config.env",
});

// Code serveur
const secret = process.env.SERVER_CODE;

// Middlewares
app.use(express.json());
app.use(cookieParser());

// ***** ROUTES ***** //

// LOGOUT
router.get("/", (req, res) => {
  res.clearCookie("jwtCookie", { path: "/" }).redirect("/");
});

module.exports = router;
