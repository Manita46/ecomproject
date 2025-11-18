const express = require('express');
const router = express.Router();
const { prisma } = require('../utils');

router.post('/create-order-status-update', async (req, res) => {
  try {
    console.log("📥 CPTMS callback:", JSON.stringify(req.body, null, 2));

    const { messageId, items } = req.body;

    if (!messageId || !items) {
      return res.status(400).json({ error: "messageId and items are required" });
    }

    //หา messageId ในตาราง job_message
    const jm = await prisma.job_message.findFirst({
      where: { messageId: String(messageId) },
      include: { job: true },
    });

    if (!jm || !jm.job) {
      return res.status(404).json({ error: "job/message not found for this messageId" });
    }

    const orderId = jm.job.orderId;

    //แกะค่าจาก items
    const jobNo =
      Array.isArray(items.jobNoSuccess) && items.jobNoSuccess.length > 0
        ? items.jobNoSuccess[0]
        : null;

    const firstOrder =
      Array.isArray(items.orderNoSuccess) && items.orderNoSuccess.length > 0
        ? items.orderNoSuccess[0]
        : null;
    const orderNo = firstOrder ? firstOrder.orderNo : null;

    const firstShipment =
      Array.isArray(items.shipmentNoSuccess) && items.shipmentNoSuccess.length > 0
        ? items.shipmentNoSuccess[0]
        : null;
    const shipmentNo = firstShipment ? firstShipment.shipmentNo : null;

    //อัปเดตตารางorder
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        jobNo,
        orderNo,
        shipmentNo,
      },
    });

    return res.json({
      ok: true,
      orderId,
      updatedOrder,
    });
  } catch (err) {
    console.error("❌ Error in CPTMS callback:", err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
