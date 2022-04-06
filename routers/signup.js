const express = require("express");
const app = express();
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const handlebars = require("express-handlebars");

// PostGres
const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });

// Code serveur
const secret = process.env.SERVER_CODE;

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

  // Création user
  try {
    await Postgres.query(
      "INSERT INTO users(username, password) VALUES($1, $2)",
      [req.body.username, hashedPassword]
    );

    const usr = await Postgres.query(
      "SELECT * FROM users WHERE users.username=$1",
      [req.body.username]
    );

    await Postgres.query(
      "UPDATE users SET isLoggedIn = true WHERE users.username=$1",
      [req.body.username]
    );

    const token = jwt.sign({ id: usr.rows[0].user_id }, secret);
    res.cookie("jwtCookie", token, {
      expires: new Date(Date.now() + 1000 * 60 * 60), // Expiration du token à 1h
      httpOnly: true,
      secure: false,
    });
    res.redirect("/profile");
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "An error happened",
    });
  }
});

module.exports = router;
