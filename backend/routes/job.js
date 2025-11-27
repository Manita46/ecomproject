const express = require('express');
const router = express.Router();
const { prisma } = require('../utils');
const { generateJobCode } = require('../createJobCode');
const moment = require('moment-timezone');

async function saveStatus(body) {
  console.log("📥 saveStatus:", JSON.stringify(body, null, 2));
  console.log("bodySave Status", body)
  const { messageId, items } = body;
  if (!messageId || !items) {
    throw new Error("messageId and items are required");
  }

  // หา messageId ในตาราง job_message
  const jm = await prisma.job_message.findFirst({
    where: { messageId: String(messageId) },
    include: { job: true },
  });

  if (!jm || !jm.job) {
    throw new Error("job/message not found for this messageId");
  }

  const job = jm.job;

  // ----- ดึงค่าจาก items -----
  const jobNo =
    Array.isArray(items.jobNoSuccess) && items.jobNoSuccess.length > 0
      ? items.jobNoSuccess[0]
      : null;

  const firstOrder =
    Array.isArray(items.orderNoSuccess) && items.orderNoSuccess.length > 0
      ? items.orderNoSuccess[0]
      : null;

  const orderNo = firstOrder?.orderNo || null;
  const upstreamTrackingNumber = firstOrder?.upstreamTrackingNumber || null;

  const firstShipment =
    Array.isArray(items.shipmentNoSuccess) && items.shipmentNoSuccess.length > 0
      ? items.shipmentNoSuccess[0]
      : null;

  const shipmentNo = firstShipment?.shipmentNo || null;

  // อัปเดต jobNo ใน table job
  if (jobNo) {
    await prisma.job.update({
      where: { id: job.id },
      data: { jobNo },
    });
  }

  await prisma.job_detail.create({
    data: {
      jobId: job.id,
      orderNo,
      shipmentNo,
      upstreamTrackingNumber,
    },
  });

  return {
    ok: true,
    jobId: job.id,
    messageId,
    savedJobNo: jobNo,
    savedJobDetail: {
      orderNo,
      upstreamTrackingNumber,
      shipmentNo,
    },
  };
}

router.post('/', async (req, res) => {
  try {
    // const orderId  = req.body.id;
    const { orderId } = req.body || null
    //orderId check
    if (!orderId) {
      return res.status(400).json({ error: "orderId is required" });
    }

    //ดึง order จาก DB
    const order = await prisma.order.findUnique({
      where: { id: Number(orderId) },
      include: { orderitem: { include: { product: true } } },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const jobCode = await generateJobCode();

    const job = await prisma.job.create({
      data: {
        orderId: order.id,
        jobCode: jobCode,
      }
    });

    const payload = {
      orders: [
        {
          "businessUnit": "BB",
          "customerSAPCode": "bankcustomer01",
          "upstreamTrackingNumber": job.jobCode,
          "sequence": "",
          "groupOrder": "",
          "surchargeDiscount": "Service for Shipper",
          "surchargeDiscountItems": "",
          "businessType": "Distribution",
          "requestedVehicleType": "4 ล้อตู้แห้งจัมโบ้",
          "itemType": "ไส้กรอก",
          "itemTypeDescription": "",
          "temperatureType": "Chill",
          "temperatureRangeMin": "",
          "temperatureRangeMax": "",
          "cargoInsurance": "YES",
          "declaredValue": "1",
          "currencyUnit": "THB",
          "origin": {
            "siteCode": "banksite02",
            "latitude": "",
            "longitude": "",
            "address": "",
            "province": "",
            "district": "",
            "subDistrict": "",
            "postalCode": "",
            "contactName": "",
            "contactNumber": ""
          },
          "targetPickUpDateFrom": "2024-06-01",
          "targetPickUpTimeFrom": "03:00",
          "targetPickUpDateTo": "2024-06-15",
          "targetPickUpTimeTo": "17:00",
          "pickUpInstruction": "Pick Up Instruction",
          "destination": {
            "siteCode": "banksite01",
            "latitude": "",
            "longitude": "",
            "address": "",
            "province": "",
            "district": "",
            "subDistrict": "",
            "postalCode": "",
            "contactName": "",
            "contactNumber": ""
          },
          "targetDeliveryDateFrom": "2024-07-01",
          "targetDeliveryTimeFrom": "09:00",
          "targetDeliveryDateTo": "2024-07-15",
          "targetDeliveryTimeTo": "10:00",
          "deliveryInstruction": "Delivery Instruction",
          "requiredReceipt": "YES",
          "receiptType": "POD",
          "numberOfReceipts": "3",
          "routeCode": "",
          "customerLineCode": "",
          "presetLine": job.jobCode, //เอาjob id from job table
          "destinationType": "Route",
          "billingNoteInvoice": "Billing Note/Invoice 1",
          "remark": "Remark 1",
          "itemName": "test item123",
          "itemDescription": "Item Description 2",
          "packageWidth": "2",
          "packageHeight": "3",
          "packageLength": "4",
          "weightPerPackage": 5,
          "numberOfPackages": 6,
          "numberOfItemsPerPackage": 7,
          "packagingUnit": "Box/005",
          "note": "shippig order testa",
          "reasonForDifferentVehicle": "reasonfordiff ja",
          "vehiclePlateNumber": "ทดสอบ3851",
          "provincialSign": "กรุงเทพมหานคร",
          "driverPhoneNumber": "66121231212",
          "trailerType": "",
          "trailerPlateNumber": "",
          "trailerProvinicialSign": "",
          "paidByVehicleType": "",
          "reason": "",
          "vendorSAPCode": "",
          "deliveryPaymentType": "Postpaid",
          "deliveryPaymentChannel": "TrueMoney",
          "itemCategory": "Product",
          "itemUnitPrice": "100",
          "orderPrice": "100",
          "currency": "THB"
        }
      ]
    };

    

    const resp = await fetch(`${process.env.OMS_URL}/orders-bulk-direct-schedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.OMS_X_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = await resp.json().catch(() => ({}));

    // จัดการผลลัพธ์ + เซฟ messageId ลงออเดอร์เรา
    if (!resp.ok) {
      return res.status(resp.status).json({
        error: "CPTMS_ERROR",
        detail: data || (await resp.text()),
      });
    }

    const messageId = data?.messageId || null;

    if (messageId) {
      await prisma.job_message.create({
        // where: { id: order.id },
        data: { 
          jobId: job.id,
          messageId: String(messageId), },
      });
    }

    return res.status(200).json({
      ok: true,
      orderId: order.id,
      jobId: job.id,
      messageId,
      cptmsResponse: data,
    });
    
  } catch (error) {
    console.error("❌ create job error:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.post('/create-order-status-update', async (req, res) => {
  try {
    console.log("🔥🔥🔥 [CALLBACK HIT] raw body:", JSON.stringify(req.body, null, 2));
    const result = await saveStatus(req.body);
    console.log("✅ saveStatus result:", result);
    return res.json(result);
  } catch (err) {
    console.error("❌ Error in callback:", err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;