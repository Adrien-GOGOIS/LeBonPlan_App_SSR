const express = require("express");
const app = express();
const router = express.Router();

// MIDDLEWARES
app.use(express.json());

router.get("/products", (req, res) => {
  res.render("products");
});

module.exports = router;
