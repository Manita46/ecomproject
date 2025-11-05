'use client';
require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const {prisma} = require('../utils');

const router = express.Router();
const { SECRET_KEY } = process.env;

// API Login รองรับทั้งแอดมินและลูกค้า
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, password: true, role: true, name: true }
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "❌ Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role }, 
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      message: `✅ ${user.role === 'ADMIN' ? 'Admin' : 'Customer'} login successful`,
      token,
      role: user.role,
      user
    });

  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API Register (เฉพาะลูกค้า)
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // ตรวจสอบว่ามีอีเมลนี้อยู่แล้วหรือไม่
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "❌ Email is already registered" });
        }

        // สร้างบัญชีผู้ใช้ใหม่
        const user = await prisma.user.create({
            data: { name, email, password },
        });

        res.status(201).json({ message: "✅ User registered successfully", user });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// API ตรวจสอบสถานะ Login
router.get("/me", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // รับ Token จาก Header
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // ตรวจสอบ Token
        const decoded = jwt.verify(token, SECRET_KEY);
        res.json({ user: decoded });
    } catch (error) {
        res.status(401).json({ error: "Invalid Token" });
    }
});

module.exports = router;
