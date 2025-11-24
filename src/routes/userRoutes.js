import express from "express";
import prisma from "../prismaClient.js";

const router = express.Router();

//Get all the users
router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    if(!users){
        return res.status(404).json({message: "Users not found"});
    }

    res.json({ users });
  } catch (error) {
    console.log(error.message);
    res.sendStatus(503);
  }
});

//Get user by Id
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if(!user){
        return res.status(404).json({message: "User not found"});
    }
    res.json({ user });
  } catch (error) {
    console.log(error.message);
    res.sendStatus(503);
  }
});

// Add a category by a user
router.post("/:userId/categories", async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, description } = req.body;

    const category = await prisma.category.findFirst({
      where: { name: name },
    });

    if (category) {
      return res.status(409).json({ message: "Category with this name already exists" });
    }

    const newCategory = await prisma.category.create({
      data: {
        user_id: userId,
        name: name,
        description: description,
      },
    });

    res.status(201).json({
      message: "Category created successfully",
      newCategory,
    });
  } catch (error) {
    console.log(error.message);
    res.sendStatus(503);
  }
});

// Update a category by a user
router.put("/:userId/categories/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, description } = req.body;

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (name) {
      const duplicate = await prisma.category.findFirst({
        where: {
          name,
          NOT: { id: categoryId },
        },
      });

      if (duplicate) {
        return res.status(409).json({ message: "Another category with this name already exists" });
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name,
        description,
      },
    });

    res.json({
      message: "Category updated successfully",
      updatedCategory,
    });
  } catch (error) {
    console.log(error.message);
    res.sendStatus(503);
  }
});

//Delete a category by a user
router.delete("/:userId/categories/:categoryId", async (req, res) => {
  try {
    const { categoryId} = req.params;

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    res.json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.sendStatus(503);
  }
});

// Add a product by a user
router.post("/:userId/categories/:categoryId/products", async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, description, price } = req.body;

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const existingProduct = await prisma.product.findFirst({
      where: {
        category_id: categoryId,
        name: name,
      },
    });

    if (existingProduct) {
      return res.status(409).json({ message: "Product with this name already exists in this category" });
    }

    const newProduct = await prisma.product.create({
      data: {
        category_id: categoryId,
        name: name,
        description: description,
        price: price,
      },
    });

    res.status(201).json({
      message: "Product created successfully",
      newProduct,
    });
  } catch (error) {
    console.log(error.message);
    res.sendStatus(503);
  }
});

// Update a product by a user
router.put("/:userId/categories/:categoryId/products/:productId", async (req, res) => {
  try {
    const { categoryId, productId } = req.params;
    const { name, description, price } = req.body;

    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        category_id: categoryId,
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found for this category" });
    }

    if (name) {
      const duplicate = await prisma.product.findFirst({
        where: {
          category_id: categoryId,
          name,
          NOT: { id: productId },
        },
      });

      if (duplicate) {
        return res.status(409).json({ message: "Another product with this name exists in this category" });
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        price,
      },
    });

    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.log(error.message);
    res.sendStatus(503);
  }
});

//Delete a product by a user
router.delete("/:userId/categories/:categoryId/products/:productId", async (req, res) => {
  try {
    const { categoryId, productId } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        category_id: categoryId,
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found for this category" });
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.sendStatus(503);
  }
});

export default router;