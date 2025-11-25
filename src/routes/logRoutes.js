import express from "express";
import prisma from "../prismaClient.js";

const router = express.Router();

//Get all the logs
router.get("/", async (req, res) => {
  try {
    const logs = await prisma.log.findMany();

    if(!logs){
        return res.status(404).json({message: "Logs not found"});
    }

    res.json({ logs });
  } catch (error) {
    console.log(error.message);
    res.sendStatus(503);
  }
});

//Get a log by Id
router.get("/:logId", async (req, res) => {
  try {
    const { logId } = req.params; 

    const log = await prisma.log.findUnique({
        where: { id: productId },
    });

    if(!log){
        return res.status(404).json({message: "Log not found"});
    }

    res.json({ log });
  } catch (error) {
    console.log(error.message);
    res.sendStatus(503);
  }
});

export default router;