import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// GET all dinear entries
// GET all dinear entries with customer names
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT d.id, d.date, d.customer_id AS customerId,
             d.value1, d.value2, d.value3, d.dinear, d.varavu,
             c.client_name AS customerName
      FROM dinear d
      LEFT JOIN clients c ON d.customer_id = c.id
      ORDER BY d.id ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error while fetching dinear entries" });
  }
});


// POST new dinear entry
// POST new dinear entry
router.post("/", async (req, res) => {
  try {
    const entry = req.body;
    const requiredFields = ["date", "customerId", "dinear"];

    for (const field of requiredFields) {
      if (!entry[field]) return res.status(400).json({ error: `${field} is required` });
    }

    // 1️⃣ Insert the new entry
    const [result] = await pool.query(
      `INSERT INTO dinear (date, customer_id, value1, value2, value3, dinear, varavu) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        entry.date,
        entry.customerId,
        entry.value1 || 0,
        entry.value2 || 0,
        entry.value3 || 0,
        entry.dinear,
        entry.varavu || 0,
      ]
    );

    // 2️⃣ Fetch customerName from clients table
    const [[client]] = await pool.query(
      "SELECT client_name AS customerName FROM clients WHERE id=?",
      [entry.customerId]
    );

    // 3️⃣ Send response including customerName
    res.status(201).json({
      id: result.insertId,
      ...entry,
      customerName: client ? client.customerName : null
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error while creating dinear entry" });
  }
});


// PUT update dinear entry
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const entry = req.body;
    console.log("BODY:", req.body);
    await pool.query(
      `UPDATE dinear SET date=?, customer_id=?, value1=?, value2=?, value3=?, dinear=?, varavu=? WHERE id=?`,
      [
        entry.date,
        entry.customerId,
        entry.value1 || 0,
        entry.value2 || 0,
        entry.value3 || 0,
        entry.dinear,
        entry.varavu || 0,
        id,
      ]
      
    );

    res.json({ message: "Dinear entry updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error while updating dinear entry" });
  }
});

// DELETE dinear entry
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM dinear WHERE id=?", [id]);
    res.json({ message: "Dinear entry deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error while deleting dinear entry" });
  }
});

export default router;
