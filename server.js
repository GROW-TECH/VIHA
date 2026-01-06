import express from "express";
import cors from "cors";
import path from "path";
import clientsRouter from "./routes/clients.js";
import ownerAccountsRouter from "./routes/owner.js";
import productionsRouter from "./routes/productions.js";
import dinearRouter from "./routes/dinear.js";
// import materialRouter from "./routes/material.js";

const app = express();

app.use(cors());
app.use(express.json());

// serve uploads
app.use("/uploads", express.static(path.resolve("uploads")));

app.get("/", (req, res) => {
  res.send("API running");
});

app.use("/api/clients", clientsRouter);
app.use("/api/owner", ownerAccountsRouter);   // ← FIXED
app.use("/api/productions-entries", productionsRouter);
app.use("/api/dinear", dinearRouter);
// app.use("/api/material", materialRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
