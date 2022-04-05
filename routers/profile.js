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
  try {
    jwt.verify(req.cookies.jwtCookie, secret);
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  if (!req.cookies.jwtCookie) {
    return res.redirect("login");
  }

  // On vérifie que ce token contient bien l'ID d'un utilisateur admin
  const decoded = jwt.verify(req.cookies.jwtCookie, secret);

  const userData = await Postgres.query(
    "SELECT * FROM users WHERE users.user_id=$1",
    [decoded.id]
  );

  res.render("profile", { username: userData.rows[0].username });
});

module.exports = router;
