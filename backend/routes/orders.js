const express = require('express');
const router = express.Router();
const { prisma } = require('../utils');
const moment = require('moment-timezone');

// เพิ่มคำสั่งซื้อใหม่
router.post('/', async (req, res) => {
    try {

        const { userId, customerName, phone, address, totalPrice, status, paymentMethod, orderItems, deliveryMethod } = req.body;
        console.log(userId, customerName, phone, address, totalPrice, status, paymentMethod, orderItems, deliveryMethod);

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ error: "No items in the order" });
        }

        const createdAt = moment().tz("Asia/Bangkok").toDate();

        const newOrder = await prisma.order.create({
            data: {
                user: { connect: { id: Number(userId) } },
                customerName: customerName || "Guest",
                phone: phone || "N/A",
                address: address || "N/A",
                totalPrice: Number(totalPrice),
                status: (status || "PENDING").toUpperCase(),
                paymentMethod: paymentMethod || "cash",
                deliveryMethod: (deliveryMethod || "TAKEAWAY").toUpperCase(),
                createdAt,
                orderitem: {
                    create: orderItems.map(item => ({
                        productId: Number(item.productId),
                        quantity: item.quantity,
                        price: item.price
                    }))
                },
            },
            include: { orderitem: { include: { product: true } } },
        });

        res.status(201).json(newOrder);
    } catch (error) { console.error("❌ Error creating order:", error.message); console.error(error); res.status(500).json({ error: error.message }); }
});

// ดึงข้อมูลคำสั่งซื้อทั้งหมด
router.get('/', async (req, res) => {
    try {
        const { isAdmin, userId } = req.query;

        // กรณีเป็น Admin จะดึงข้อมูลทั้งหมด
        if (isAdmin === 'true') {
            const orders = await prisma.order.findMany({
                include: { orderitem: { include: { product: true } } },
                orderBy: { createdAt: 'desc' }
            });
            return res.json(orders);
        }

        // กรณีเป็น User ปกติจะดึงเฉพาะข้อมูลของตัวเอง
        if (!userId) {
            return res.json([]);
        }

        const orders = await prisma.order.findMany({
            where: { userId: Number(userId) },
            include: { orderitem: { include: { product: true } } },
            orderBy: { createdAt: 'desc' }
        });

        res.json(orders);
    } catch (error) {
        return res.status(500).json([]);
    }
});

// ดึงข้อมูลคำสั่งซื้อตาม `id`
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const order = await prisma.order.findUnique({
            where: { id: Number(id) },
            include: { orderitem: { include: { product: true } } }
        });

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.json(order);
    } catch (error) {
        console.error("❌ Error fetching order:", error);
        res.status(500).json({ error: error.message });
    }
});

// อัปเดตสถานะคำสั่งซื้อ
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        console.log("Received update request for order:", id, "with status:", status);

        const validStatuses = ["PENDING", "SHIPPED", "COMPLETED", "CANCELED"];
        if (!validStatuses.includes(status.toUpperCase())) {
            return res.status(400).json({ error: "Invalid status value" });
        }

        const updatedStatus = status.toUpperCase();
        console.log(updatedStatus);

        const updatedOrder = await prisma.order.update({
            where: { id: Number(id) },
            data: { status: updatedStatus }
        });

        res.json(updatedOrder);
    } catch (error) {
        console.error("❌ Error updating order status:", error);
        res.status(500).json({ error: error.message });
    }
});

// ลบคำสั่งซื้อตาม `id`
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // ลบสินค้าที่อยู่ในคำสั่งซื้อนี้ก่อน (ป้องกัน Foreign Key Constraint)
        await prisma.orderitem.deleteMany({
            where: { orderId: Number(id) }
        });

        const deletedOrder = await prisma.order.delete({
            where: { id: Number(id) }
        });


        res.json({ message: "Order deleted successfully", deletedOrder });
    } catch (error) {
        console.error("❌ Error creating order:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;