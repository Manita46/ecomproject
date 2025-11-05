const express = require('express');
const router = express.Router();
const { prisma } = require('../utils');

const { DateTime } = require('luxon');

// ✅ เพิ่มรีวิวใหม่
router.post('/', async (req, res) => {
    try {
        const { name, message } = req.body;

        // ตรวจสอบค่าที่ส่งมา
        if (!name || !message) {
            return res.status(400).json({ error: "Name and message are required!" });
        }

        const newReview = await prisma.review.create({
            data: {
                name,
                message,
                createdAt: DateTime.now().setZone('Asia/Bangkok').toISO()
            }
        });

        res.status(201).json({ success: true, review: newReview });
    } catch (error) {
        console.error("❌ Error adding review:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/', async (req, res) => {
    try {
        const reviews = await prisma.review.findMany();

        // ✅ แปลง createdAt เป็นเวลาไทย
        const formattedReviews = reviews.map(review => ({
            ...review,
            createdAt: DateTime.fromISO(review.createdAt.toISOString())
                .setZone('Asia/Bangkok')
                .toFormat('yyyy-MM-dd HH:mm:ss')
        }));

        res.json(formattedReviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
