const express = require('express');
const router = express.Router();
const { prisma } = require("../utils")

// API ดึงสินค้าทั้งหมด
router.get('/', async (req, res) => {
    try {
        const data = await prisma.product.findMany({
            include: { category: true }
        });

        res.status(200).json(data);
    } catch (error) {
        console.error("❌ Error fetching products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// API ดึงสินค้าตามประเภท
router.get('/:category', async (req, res) => {
    try {
        const categoryName = req.params.category;

        // ✅ ค้นหา Category ID จากชื่อประเภท
        const category = await prisma.category.findFirst({
            where: { name: categoryName },
            select: { id: true }
        });

        if (!category) {
            return res.status(404).json({ error: `Category '${categoryName}' not found` });
        }

        // ✅ ดึงสินค้าตาม Category ID
        const products = await prisma.product.findMany({
            where: { categoryId: category.id },
            include: { category: true }
        });

        res.status(200).json(products);
    } catch (error) {
        console.error("❌ Error fetching products by category:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ API เพิ่มสินค้าใหม่
router.post('/', async (req, res) => {
    try {
        const { name, price, description, image, categoryId } = req.body;

        if (!name || !price) {
            return res.status(400).json({ error: "Name and price are required." });
        }

        const newProduct = await prisma.product.create({
            data: {
                name,
                price: Number(price),
                description: description || null,
                // ingredients: ingredients || null,
                image: image || null,
                categoryId: categoryId ? Number(categoryId) : null
            },
        });

        res.status(201).json(newProduct);
    } catch (error) {
        console.error("❌ Error adding product:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ API อัปเดตสินค้า
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, price, description, image, categoryId } = req.body;
    const updatedProduct = await prisma.product.update({
        where: { id: Number(id) },
        data: {
                name,
                price: Number(price),
                description: description || null,
                image: image || null,
                categoryId: categoryId ? Number(categoryId) : null,
            },
    });
    res.json(updatedProduct);
    
});

// ✅ API ลบสินค้า
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.product.delete({ where: { id: Number(id) } });
    res.status(204).end();
});


// ✅ API ดึงสินค้าสำหรับ Admin (เฉพาะ `/api/admin/products`)
// router.get('/', async (req, res) => {
//     try {
//         const products = await prisma.product.findMany();
//         res.status(200).json(products);
//     } catch (error) {
//         console.error("❌ Error fetching admin products:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

// npx prisma init

module.exports = router;
