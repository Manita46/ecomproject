const express = require('express');
const router = express.Router();
const {prisma} = require('../utils')

// API สร้าง
router.post('/', async (req, res) => {
    const body = await req.body

    const data = await prisma.category.create({
        data: {
            name: body.name,
        }
    })

    res.json(data)
})

// API ดึงสินค้าทั้งหมด
router.get('/', async (req, res) => {
    const data = await prisma.category.findMany()

    res.json(data)
});

// DELETE localhost:5000/api/categories/:id <---
router.delete("/:id", async (req, res) => {
    const id = req.params.id

    const data = await prisma.category.delete({
        where:{id: Number(id)}
    })

    res.json(data)
})

router.put('/:id', async (req, res) => {
    const body = await req.body
    const id = req.params.id

    const data = await prisma.category.update({
        where: {
            id: Number(id)
        },
        data: {
            name: body.name,
        }
    })

    res.json(data)
})

module.exports = router;