const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
// MIDDLEWARES

app.use(cookieParser());
const handlebars = require("express-handlebars");

// handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");

// Code serveur
const secret = process.env.SERVER_CODE;

router.get("/", (req, res) => {
  try {
    jwt.verify(req.cookies.jwtCookie, secret);
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  // if (!token) {
  //     return res.redirect("login");
  //   }
  //   const userData = await Postgres.query(
  //     "SELECT * FROM users WHERE users.username=$1",
  //     [req.body.username]
  //   )
  //   res.render("profile", { username: userData.row[0].username });
  res.render("profile");
});

module.exports = router;
