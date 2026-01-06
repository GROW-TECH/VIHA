import express from "express";
import { pool } from "../db.js";

const router = express.Router();

/* ===== GET ALL ACCOUNTS ===== */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM owner_accounts ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    console.error("GET /owner ERROR:", err);
    res.status(500).json({ error: "Failed to fetch accounts" });
  }
});

/* ===== ADD ACCOUNT ===== */
router.post("/", async (req, res) => {
  try {
    console.log("POST /owner body:", req.body);

    const { holderName, accountNumber, bankName } = req.body;

    if (!holderName || !accountNumber || !bankName) {
      return res.status(400).json({ error: "holderName, accountNumber, and bankName are required" });
    }

    const [result] = await pool.query(
      `INSERT INTO owner_accounts (holderName, accountNumber, bankName) VALUES (?, ?, ?)`,
      [holderName, accountNumber, bankName]
    );

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error("POST /owner ERROR:", err);
    res.status(500).json({ error: "Failed to create account" });
  }
});


/* ===== UPDATE ACCOUNT ===== */
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { holderName, accountNumber, bankName } = req.body;

    if (!holderName || !accountNumber || !bankName) {
      return res.status(400).json({ error: "holderName, accountNumber, and bankName are required" });
    }

    await pool.query(
      `UPDATE owner_accounts SET holderName=?, accountNumber=?, bankName=? WHERE id=?`,
      [holderName, accountNumber, bankName, id]
    );

    res.json({ message: "Account updated" });
  } catch (err) {
    console.error("PUT /owner/:id ERROR:", err);
    res.status(500).json({ error: "Failed to update account" });
  }
});

/* ===== DELETE ACCOUNT ===== */
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const [result] = await pool.query("DELETE FROM owner_accounts WHERE id=?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Account not found" });
    }

    res.json({ message: "Account deleted" });
  } catch (err) {
    console.error("DELETE /owner/:id ERROR:", err);
    res.status(500).json({ error: "Failed to delete account" });
  }
});

export default router;
