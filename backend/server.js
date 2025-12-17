const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

// ================= MYSQL =================
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "MySql@1234",
  database: "viha_db",
});

// ================= TEST =================
app.get("/", (req, res) => {
  res.send("Viha Server Running ✅");
});

// ================= PRODUCTS =================

// GET products
app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// ADD product
app.post("/products", (req, res) => {
  const { productCode, productName, qty, description } = req.body;

  const sql = `
    INSERT INTO products 
    (id, product_code, product_name, qty, description, created_at)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;

  db.query(
    sql,
    [uuidv4(), productCode, productName, qty, description],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Product added ✅" });
    }
  );
});

// DELETE product
app.delete("/products/:id", (req, res) => {
  db.query("DELETE FROM products WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Product deleted" });
  });
});

// ================= MATERIALS (🔥 THIS FIXES YOUR ERROR) =================

// GET materials
app.get("/materials", (req, res) => {
  db.query("SELECT * FROM materials", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// ADD material
app.post("/materials", (req, res) => {
  const {
    id,
    materialCode,
    materialName,
    description,
    colorCode,
    availableQty,
  } = req.body;

  const sql = `
    INSERT INTO materials
    (id, material_code, material_name, description, color_code, available_qty)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      id || uuidv4(),
      materialCode,
      materialName,
      description,
      colorCode,
      availableQty,
    ],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Material added ✅" });
    }
  );
});

// UPDATE material
app.put("/materials", (req, res) => {
  const {
    id,
    materialCode,
    materialName,
    description,
    colorCode,
    availableQty,
  } = req.body;

  const sql = `
    UPDATE materials SET
    material_code=?,
    material_name=?,
    description=?,
    color_code=?,
    available_qty=?
    WHERE id=?
  `;

  db.query(
    sql,
    [materialCode, materialName, description, colorCode, availableQty, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Material updated ✅" });
    }
  );
});

// DELETE material
app.delete("/materials/:id", (req, res) => {
  db.query("DELETE FROM materials WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Material deleted" });
  });
});

// ================= SERVER =================
app.listen(4000, () => {
  console.log("✅ Server running on http://localhost:4000");
});
