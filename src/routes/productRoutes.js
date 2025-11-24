import express from "express";
import prisma from "../prismaClient.js";

const router = express.Router();

//Get all the products
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany();

    if(!products){
        return res.status(404).json({message: "Products not found"});
    }

    res.json({ products });
  } catch (error) {
    console.log(error.message);
    res.sendStatus(503);
  }
});

//Get a product by Id
router.get("/:productId", async (req, res) => {
  try {
    const { productId } = req.params; 

    const product = await prisma.product.findUnique({
        where: { id: productId },
    });

    if(!product){
        return res.status(404).json({message: "Product not found"});
    }

    res.json({ product });
  } catch (error) {
    console.log(error.message);
    res.sendStatus(503);
  }
});

export default router;