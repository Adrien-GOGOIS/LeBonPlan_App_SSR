const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const handlebars = require("express-handlebars");

// handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");

// PostGres
const { Pool } = require("pg");
const { createCipheriv } = require("crypto");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });

// Code serveur
const secret = process.env.SERVER_CODE;

// MIDDLEWARES
app.use(express.json());

router.get("/", (req, res) => {
  res.render("login");
});

// LOGIN
router.post("/", async (req, res) => {
  const { username, password } = req.body;
  try {
    const usr = await Postgres.query(
      "SELECT * FROM users WHERE users.username=$1",
      [username]
    );

    if (!usr.rows) {
      res.status(400).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      usr.rows[0].password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: usr.rows[0].user_id }, secret);
    res.cookie("jwtCookie", token, {
      expires: new Date(Date.now() + 1000 * 60 * 60), // Expiration du token à 1h
      httpOnly: true,
      secure: false,
    });

    res.status(200).json({
      message: "Auth cookie ready",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "An error happened" });
  }
});

module.exports = router;
