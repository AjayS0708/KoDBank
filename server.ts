import express from "express";
import { createServer as createViteServer } from "vite";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || "kodbank-super-secret-key-123";
const PORT = 3000;

// Initialize Database
const db = new Database("kodbank.db");

// Create Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS KodUser (
    uid TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    balance REAL DEFAULT 100000.0,
    phone TEXT,
    role TEXT DEFAULT 'customer'
  );

  CREATE TABLE IF NOT EXISTS UserToken (
    tid INTEGER PRIMARY KEY AUTOINCREMENT,
    token TEXT NOT NULL,
    uid TEXT NOT NULL,
    expiry INTEGER NOT NULL,
    FOREIGN KEY (uid) REFERENCES KodUser(uid)
  );
`);

async function startServer() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());

  // API Routes
  
  // 1. Registration
  app.post("/api/register", async (req, res) => {
    const { uid, uname, password, email, phone, role } = req.body;
    
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const stmt = db.prepare(`
        INSERT INTO KodUser (uid, username, email, password, phone, role, balance)
        VALUES (?, ?, ?, ?, ?, ?, 100000.0)
      `);
      stmt.run(uid, uname, email, hashedPassword, phone, role || 'customer');
      res.status(201).json({ message: "Registration successful" });
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(400).json({ error: error.message || "Registration failed" });
    }
  });

  // 2. Login
  app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;

    try {
      const user: any = db.prepare("SELECT * FROM KodUser WHERE username = ?").get(username);
      
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // Generate JWT
      const token = jwt.sign(
        { username: user.username, role: user.role, uid: user.uid },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      const expiry = Math.floor(Date.now() / 1000) + 3600;

      // Store token in DB
      db.prepare("INSERT INTO UserToken (token, uid, expiry) VALUES (?, ?, ?)").run(token, user.uid, expiry);

      // Set cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 3600000, // 1 hour
      });

      res.json({ message: "Login successful", user: { username: user.username, role: user.role } });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // 3. Check Balance (Protected)
  app.get("/api/balance", (req, res) => {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      // Verify JWT
      const decoded: any = jwt.verify(token, JWT_SECRET);
      
      // Check if token exists in DB
      const tokenRecord = db.prepare("SELECT * FROM UserToken WHERE token = ?").get(token);
      if (!tokenRecord) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }

      // Fetch balance
      const user: any = db.prepare("SELECT balance FROM KodUser WHERE username = ?").get(decoded.username);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ balance: user.balance });
    } catch (error) {
      console.error("Balance check error:", error);
      res.status(401).json({ error: "Invalid token" });
    }
  });

  // 4. Logout
  app.post("/api/logout", (req, res) => {
    const token = req.cookies.token;
    if (token) {
      db.prepare("DELETE FROM UserToken WHERE token = ?").run(token);
    }
    res.clearCookie("token");
    res.json({ message: "Logged out" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
