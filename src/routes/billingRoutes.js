import express from "express";
import prisma from "../prismaClient.js";

const router = express.Router();

//Get all the bills
router.get("/", async (req, res) => {
  try {
    const billings = await prisma.billing.findMany();

    if(!billings){
        return res.status(404).json({message: "Billings not found"});
    }

    res.json({ billings });
  } catch (error) {
    console.log(error.message);
    res.sendStatus(503);
  }
});

//Get a bill by Id
router.get("/:billingId", async (req, res) => {
  try {
    const { billingId } = req.params; 

    const billing = await prisma.billing.findUnique({
        where: { id: billingId },
    });

    if(!billing){
        return res.status(404).json({message: "Billing not found"});
    }

    res.json({ billing });
  } catch (error) {
    console.log(error.message);
    res.sendStatus(503);
  }
});

// Get billing items of a bill
router.get("/:billingId/items", async (req, res) => {
  try {
    const { billingId } = req.params;

    const items = await prisma.billing_item.findMany({
      where: { billing_id: billingId },
      include: { product: true },
    });

    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch billing items" });
  }
});

export default router;