import express from "express";
import prisma from "../prismaClient.js";

const router = express.Router();

//Get all the categories
router.get("/", async (req, res) => {
  try {
    const categories = await prisma.category.findMany();

    if(!categories){
        return res.status(404).json({message: "Categories not found"});
    }

    res.json({ categories });
  } catch (error) {
    console.log(error.message);
    res.sendStatus(503);
  }
});

//Get a category by Id
router.get("/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params; 

    const category = await prisma.category.findUnique({
        where: { id: categoryId },
    });

    if(!category){
        return res.status(404).json({message: "Category not found"});
    }

    res.json({ category });
  } catch (error) {
    console.log(error.message);
    res.sendStatus(503);
  }
});

export default router;