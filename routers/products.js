const express = require("express");
const app = express();
const router = express.Router();

// MIDDLEWARES
app.use(express.json());

// PostGres
const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });

router.get("/", (req, res) => {
  res.render("products");
});

router.get("/cities/:city", async (req, res) => {
  const product = await Postgres.query(
    "SELECT * FROM products WHERE city='" + req.params.city + "'"
  );
  console.log("PRODUITS", product.rows[0]);
  res.render("products", { prod: product.rows[0] });
});

router.get("/:id", async (req, res) => {
  const product = await Postgres.query(
    "SELECT * FROM products WHERE product_id='" + req.params.id + "'"
  );
  res.render("products", { prod: product.rows[0] });
});

module.exports = router;
