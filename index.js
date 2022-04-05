const express = require("express");
const app = express();
const path = require("path");

const handlebars = require("express-handlebars");

// Middleware
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));

// handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");

// Import router
const users = require("./routers/users.js");
const products = require("./routers/products.js");

// Routes de l'API
app.use("/users", users);
app.use("/profile", users);
app.use("/login", users);
app.use("/signup", users);
app.use("/users", users);
app.use("/products", products);

app.get("/", (req, res) => {
  res.render("homepage");
});

app.listen(8000, () => console.log("Listen on port 8000"));
