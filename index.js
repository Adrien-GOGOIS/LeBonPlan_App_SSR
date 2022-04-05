const express = require("express");
const app = express();
const path = require("path");

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const handlebars = require("express-handlebars");

const dotenv = require("dotenv");
dotenv.config({
  path: "./config.env",
});

const { Pool } = require("pg");

const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });

// Middleware
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));

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

app.get("/", (req, res) => {
  res.render("homepage");
});

app.listen(8000, () => console.log("Listen on port 8000"));
