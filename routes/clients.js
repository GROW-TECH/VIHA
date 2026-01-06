import express from "express";
import { pool } from "../db.js";

const router = express.Router();

/* ===== GET ALL CLIENTS ===== */
router.get("/", async (req, res) => {
  try {
    const [clients] = await pool.query("SELECT * FROM clients ORDER BY id ASC");
    const [accounts] = await pool.query("SELECT * FROM client_accounts");

    // Merge accounts into client objects
    const clientsWithAccounts = clients.map((c) => ({
      ...c,
      accounts: accounts
        .filter((a) => a.client_id === c.id)
        .map((a) => ({
          id: a.id,
          account_name: a.account_name,
          account_number: a.account_number,
        })),
    }));

    res.json(clientsWithAccounts);
  } catch (err) {
    console.error("GET /clients ERROR:", err);
    res.status(500).json({ error: "Failed to fetch clients" });
  }
});

/* ===== ADD CLIENT ===== */
router.post("/", async (req, res) => {
  try {
    const { client_name, mobile, accounts } = req.body;

    if (!client_name || !mobile) {
      return res.status(400).json({ error: "client_name and mobile are required" });
    }

    // Insert client basic info
    const [result] = await pool.query(
      "INSERT INTO clients (client_name, mobile) VALUES (?, ?)",
      [client_name, mobile]
    );
    const clientId = result.insertId;

    // Insert multiple accounts if provided
    if (accounts && accounts.length) {
      const accountValues = accounts.map((a) => [
        clientId,
        a.account_name || null,
        a.account_number || null,
      ]);
      await pool.query(
        "INSERT INTO client_accounts (client_id, account_name, account_number) VALUES ?",
        [accountValues]
      );
    }

    res.status(201).json({ id: clientId });
  } catch (err) {
    console.error("POST /clients ERROR:", err);
    res.status(500).json({ error: "Failed to create client" });
  }
});

/* ===== UPDATE CLIENT ===== */
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { client_name, mobile, accounts } = req.body;

    if (!client_name || !mobile) {
      return res.status(400).json({ error: "client_name and mobile are required" });
    }

    // Update client basic info only
    await pool.query(
      "UPDATE clients SET client_name=?, mobile=? WHERE id=?",
      [client_name, mobile, id]
    );

    // Delete old accounts
    await pool.query("DELETE FROM client_accounts WHERE client_id=?", [id]);

    // Insert new accounts
    if (accounts && accounts.length) {
      const accountValues = accounts.map((a) => [
        id,
        a.account_name || null,
        a.account_number || null,
      ]);
      await pool.query(
        "INSERT INTO client_accounts (client_id, account_name, account_number) VALUES ?",
        [accountValues]
      );
    }

    res.json({ message: "Client updated successfully" });
  } catch (err) {
    console.error("PUT /clients/:id ERROR:", err);
    res.status(500).json({ error: "Failed to update client" });
  }
});

/* ===== DELETE CLIENT ===== */
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Delete client accounts first (optional but safer)
    await pool.query("DELETE FROM client_accounts WHERE client_id=?", [id]);

    // Delete client
    const [result] = await pool.query("DELETE FROM clients WHERE id=?", [id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Client not found" });

    res.json({ message: "Client deleted successfully" });
  } catch (err) {
    console.error("DELETE /clients/:id ERROR:", err);
    res.status(500).json({ error: "Failed to delete client" });
  }
});

export default router;
