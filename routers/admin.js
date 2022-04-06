const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
// MIDDLEWARES

app.use(cookieParser());
const handlebars = require("express-handlebars");

const { Pool } = require("pg");

const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });

// handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");

// Code serveur
const secret = process.env.SERVER_CODE;

router.get("/", async (req, res) => {
  if (!req.cookies.jwtCookie) {
    return res.redirect("/login");
  }

  try {
    jwt.verify(req.cookies.jwtCookie, secret);
  } catch (err) {
    console.log(err);
  }

  res.render("admin");
});

router.post("/", async (req, res) => {
  const { name, price, city, description } = req.body;

  try {
    // On vérifie que ce token contient bien l'ID d'un utilisateur admin
    const decoded = jwt.verify(req.cookies.jwtCookie, secret);

    const userData = await Postgres.query(
      "SELECT * FROM users WHERE users.user_id=$1",
      [decoded.id]
    );

    console.log("ID", userData.rows[0].user_id);
    console.log("QUERY", req.body);

    await Postgres.query(
      "INSERT INTO products(name, price, city, description, user_id) VALUES($1, $2, $3, $4, $5)",
      [name, price, city, description, userData.rows[0].user_id]
    );
    res.json({ message: "Product added" });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
