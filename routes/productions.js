import express from "express";
import { pool } from "../db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

/* =========================
   FILE UPLOAD CONFIG
========================= */
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files allowed"));
    }
    cb(null, true);
  },
});

/* =========================
   GET ALL ENTRIES
========================= */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM material_entries ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   ADD ENTRY
========================= */
/* =========================
   ADD ENTRY - SAFE VERSION
========================= */
router.post("/", upload.single("photo"), async (req, res) => {
  try {
    // Ensure req.body exists
    if (!req.body) {
      return res.status(400).json({ message: "No data received" });
    }

    // Use destructuring with defaults
    const {
      date = null,
      customerId = null,
      customerName = null,
      material = "",
      pattru = 0,
      varavu = 0,
      kattai = 0,
      sareeCount = 0,
      cooliePerSaree = 0,
      totalCoolie = 0,
      paySalary = 0,
      salaryPaid = 0,
      accountNumber = null,
    } = req.body; 

    console.log("BODY:", req.body );

    // Basic validation
    if (!date || !customerId || !customerName) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const paySalaryFlag = paySalary === "1" || paySalary === "true" ? 1 : 0;
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // Get previous balances
    const [[coolieRow]] = await pool.query(
      "SELECT COALESCE(SUM(coolie_per_saree),0) AS total FROM material_entries WHERE customer_id=?",
      [customerId]
    );
    const [[salaryRow]] = await pool.query(
      "SELECT COALESCE(SUM(salary_paid),0) AS total FROM material_entries WHERE customer_id=?",
      [customerId]
    );

    const totalCoolieSum = Number(coolieRow.total);
    const totalSalarySum = Number(salaryRow.total);
    const currentPayment = Number(salaryPaid);

    const pendingSalary = totalCoolieSum - (totalSalarySum + currentPayment);

    // Insert into database
    const sql = `
      INSERT INTO material_entries
      (entry_date, customer_id, customer_name, material, pattru, varavu, kattai, saree_count, coolie_per_saree, total_coolie, pay_salary, salary_paid, bakki_amount, account_number, photo_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
      date,
      customerId,
      customerName,
      material,
      Number(pattru),
      Number(varavu),
      Number(kattai),
      Number(sareeCount),
      Number(cooliePerSaree),
      Number(totalCoolie),
      paySalaryFlag,
      Number(salaryPaid),
      pendingSalary,
      accountNumber || null,
      photoUrl,
    ]);

    res.json({
      message: "Entry added successfully",
      id: result.insertId,
      photoUrl,
      bakki: pendingSalary,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   UPDATE ENTRY
========================= */
router.put("/:id", upload.single("photo"), async (req, res) => {
  try {
    const id = req.params.id;
    const d = req.body;

    const [exist] = await pool.query(
      "SELECT photo_url FROM material_entries WHERE id=?",
      [id]
    );
    if (!exist.length) return res.status(404).json({ message: "Entry not found" });

    const oldPhoto = exist[0].photo_url;
    let newPhotoUrl = oldPhoto;

    if (req.file) {
      newPhotoUrl = `/uploads/${req.file.filename}`;
      if (oldPhoto && fs.existsSync(`.${oldPhoto}`)) {
        fs.unlinkSync(`.${oldPhoto}`);
      }
    }

    const paySalary = d.paySalary == "1" || d.paySalary == "true" ? 1 : 0;

    await pool.query(
      `
        UPDATE material_entries 
        SET entry_date=?, customer_id=?, customer_name=?, material=?, pattru=?, varavu=?, kattai=?, saree_count=?, coolie_per_saree=?, total_coolie=?, pay_salary=?, salary_paid=?, bakki_amount=?, account_number=?, photo_url=? 
        WHERE id=?
      `,
      [
        d.date,
        d.customerId,
        d.customerName,
        d.material,
        Number(d.pattru || 0),
        Number(d.varavu || 0),
        Number(d.kattai || 0),
        Number(d.sareeCount || 0),
        Number(d.cooliePerSaree || 0),
        Number(d.totalCoolie || 0),
        paySalary,
        Number(d.salaryPaid || 0),
        Number(d.bakkiAmount || 0), // (keep bakki as-is on edit)
        d.accountNumber || null,
        newPhotoUrl,
        id,
      ]
    );

    res.json({ message: "Updated", photoUrl: newPhotoUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   DELETE ENTRY
========================= */
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const [rows] = await pool.query(
      "SELECT photo_url FROM material_entries WHERE id=?",
      [id]
    );

    if (rows.length && rows[0].photo_url) {
      const p = `.${rows[0].photo_url}`;
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }

    await pool.query("DELETE FROM material_entries WHERE id=?", [id]);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
