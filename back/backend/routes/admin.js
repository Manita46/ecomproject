const express = require('express');
const bcrypt = require('bcryptjs');
const { prisma } = require('../utils');
const router = express.Router();

// ดึงข้อมูลแอดมิน 
router.get('/', async (req, res) => {
    try {
        const admin = await prisma.admin.findFirst();
        if (!admin) return res.status(404).json({ error: "❌ No admin found" });
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ error: "❌ Failed to fetch admin" });
    }
});

// ❌ ปิด API เพิ่มแอดมินใหม่ (ถ้ามีแอดมินอยู่แล้ว)
router.post('/add', async (req, res) => {
    try {
        const existingAdmin = await prisma.admin.findFirst();
        if (existingAdmin) {
            return res.status(403).json({ error: "❌ Only one admin is allowed!" });
        }

        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await prisma.admin.create({
            data: { email, password: hashedPassword }
        });

        res.status(201).json({ message: "✅ Admin created", admin: newAdmin });
    } catch (error) {
        res.status(500).json({ error: "❌ Failed to create admin" });
    }
});

// ❌ ปิด API ลบแอดมิน (ห้ามลบแอดมินตัวเอง)
router.delete('/delete/:id', async (req, res) => {
    return res.status(403).json({ error: "❌ Admin deletion is not allowed!" });
});

module.exports = router;
