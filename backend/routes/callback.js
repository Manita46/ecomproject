const express = require('express');
const router = express.Router();
const { prisma } = require('../utils');

router.post('/create-order-status-update', async (req, res) => {
  try {
    const { messageId, items } = req.body;

    if (!messageId) {
      return res.status(400).json({ error: "messageId is required" });
    }

    const job = await prisma.job.findUnique({
      where: { messageId },
      include: { order: true },
    });

    if (!job) {
      return res.status(404).json({ error: "Job not found for this messageId" });
    }

    const orderNo = items?.orderNoSuccess?.[0]?.orderNo || null;
    const shipmentNo = items?.shipmentNoSuccess?.[0]?.shipmentNo || null;
    const jobNo = items?.jobNoSuccess?.[0] || null;

    const updatedOrder = await prisma.order.update({
      where: { id: job.orderId },
      data: {
        orderNo,
        shipmentNo,
        jobNo,
      },
    });

    console.log("✅ Updated order from CPTMS callback:", updatedOrder.id);

    return res.json({
      ok: true,
      message: "CPTMS callback processed successfully",
      updatedOrder,
    });

  } catch (error) {
    console.error("❌ Error handling CPTMS callback:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
