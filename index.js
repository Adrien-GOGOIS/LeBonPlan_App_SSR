const express = require("express");
const app = express();
const path = require("path");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const handlebars = require("express-handlebars");

// handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");

// PostGres
const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });

const dotenv = require("dotenv");
dotenv.config({
  path: "./config.env",
});

// Code serveur
const secret = process.env.SERVER_CODE;

// Middleware
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

let log = false;
let name = "";

async function isLoggedIn(req, res, next) {
  try {
    jwt.verify(req.cookies.jwtCookie, secret);
  } catch (err) {
    console.log(err);
  }

  // On vérifie que ce token contient bien l'ID d'un utilisateur connecté
  const decoded = jwt.verify(req.cookies.jwtCookie, secret);

  const userData = await Postgres.query(
    "SELECT * FROM users WHERE users.user_id=$1",
    [decoded.id]
  );

  if (userData.rows[0].isloggedin) {
    log = true;
    name = userData.rows[0].username;
  }

  next();
}

// handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");

// Import router
const users = require("./routers/users.js");
const products = require("./routers/products.js");
const login = require("./routers/login.js");
const signup = require("./routers/signup.js");
const profile = require("./routers/profile.js");

// Routes de l'API
app.use("/users", users);
app.use("/profile", profile);
app.use("/login", login);
app.use("/signup", signup);
app.use("/products", products);

app.get("/", isLoggedIn, (req, res) => {
  res.render("homepage", { isLoggedIn: log, username: name });
});

app.listen(8000, () => console.log("Listen on port 8000"));
