// const express = require('express');
// const router = express.Router();
// const { prisma } = require('../utils');

// router.post('/create-order-status-update', async (req, res) => {
//   try {
//     console.log("📥 CPTMS callback:", JSON.stringify(req.body, null, 2));

//     const { messageId, items } = req.body;

//     if (!messageId || !items) {
//       return res.status(400).json({ error: "messageId and items are required" });
//     }

//     const jm = await prisma.job_message.findFirst({
//       where: { messageId: String(messageId) },
//       include: { job: true },
//     });

//     if (!jm || !jm.job) {
//       return res.status(404).json({ error: "job/message not found for this messageId" });
//     }

//     const job = jm.job;

//     const jobNo =
//       Array.isArray(items.jobNoSuccess) && items.jobNoSuccess.length > 0
//         ? items.jobNoSuccess[0]
//         : null;

//     const firstOrder =
//       Array.isArray(items.orderNoSuccess) && items.orderNoSuccess.length > 0
//         ? items.orderNoSuccess[0]
//         : null;

//     const orderNo = firstOrder?.orderNo || null;
//     const upstreamTrackingNumber = firstOrder?.upstreamTrackingNumber || null;

//     const firstShipment =
//       Array.isArray(items.shipmentNoSuccess) && items.shipmentNoSuccess.length > 0
//         ? items.shipmentNoSuccess[0]
//         : null;

//     const shipmentNo = firstShipment?.shipmentNo || null;

//     if (jobNo) {
//       await prisma.job.update({
//         where: { id: job.id },
//         data: { jobNo },
//       });
//     }

//     await prisma.job_detail.create({
//       data: {
//         id: job.id,
//         orderNo: orderNo,
//         shipmentNo: shipmentNo,
//         upstreamTrackingNumber: upstreamTrackingNumber,
//       }
//     });

//     return res.json({
//       ok: true,
//       jobId: job.id,
//       messageId,
//       savedJobNo: jobNo,
//       savedJobDetail: {
//         orderNo,
//         upstreamTrackingNumber,
//         shipmentNo
//       }
//     });

//   } catch (err) {
//     console.error("❌ Error in CPTMS callback:", err);
//     return res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;