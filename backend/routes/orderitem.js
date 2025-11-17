const express = require('express');
const router = express.Router();
const { prisma } = require('../utils');

// เพิ่มสินค้าเข้าไปในออเดอร์
router.post('/', async (req, res) => {
    try {
        const { orderId, productId, quantity, price, userid } = req.body;

        const newOrderItem = await prisma.orderItem.create({
            data: {
                orderId: Number(orderId),
                productId: Number(productId),
                quantity: Number(quantity),
                price: Number(price),
                userid: String(userid)
            }
        });

        res.status(201).json(newOrderItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ดึงข้อมูล OrderItem ทั้งหมด
router.get('/', async (req, res) => {
    try {
        const orderItems = await prisma.orderItem.findMany({
            include: { product: true, order: true }
        });

        res.json(orderItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//ดึงข้อมูล OrderItem ตาม `id`
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const orderItem = await prisma.orderItem.findUnique({
            where: { id: Number(id) },
            include: { product: true, order: true }
        });

        if (!orderItem) {
            return res.status(404).json({ error: "Order Item not found" });
        }

        res.json(orderItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//อัปเดตจำนวนสินค้าใน OrderItem
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity, price } = req.body;

        const updatedOrderItem = await prisma.orderItem.update({
            where: { id: Number(id) },
            data: {
                quantity: Number(quantity),
                price: Number(price)
            }
        });

        res.json(updatedOrderItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//ลบ OrderItem ตาม `id`
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedOrderItem = await prisma.orderItem.delete({
            where: { id: Number(id) }
        });

        res.json({ message: "OrderItem deleted successfully", deletedOrderItem });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
