const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const handlebars = require("express-handlebars");

// PostGres
const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });

// handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");

// MIDDLEWARES
app.use(express.json());

router.get("/", (req, res) => {
  res.render("signup");
});

// REGISTER
router.post("/", async (req, res) => {
  // Hashage password
  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  console.log(req.body.username, hashedPassword);
  // Création user
  try {
    await Postgres.query(
      "INSERT INTO users(username, password) VALUES($1, $2)",
      [req.body.username, hashedPassword]
    );

    res.json({
      message: `Student ${req.body.username} added to data base`,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "An error happened",
    });
  }
});

module.exports = router;
