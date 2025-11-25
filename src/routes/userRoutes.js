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

// Add a item to a cart by a user
router.post("/:userId/carts", async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    const existing = await prisma.billing_cart_item.findFirst({
      where: { 
        user_id: userId, 
        product_id: productId,
      }
    });

    let item;

    if (existing) {
      // Update quantity
      item = await prisma.billing_cart_item.update({
        where: { id: existing.id },
        data: {
          quantity: existing.quantity + quantity
        }
      });
    } else {
      // Create new cart item
      item = await prisma.billing_cart_item.create({
        data: { 
          user_id: userId, 
          product_id: productId, 
          quantity: quantity,
        }
      });
    }

    res.json(item);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to add to cart" });
  }
});

// Get the cart by a user
router.get("/:userId/carts", async (req, res) => {
  try {
    const { userId } = req.params;

    const items = await prisma.billing_cart_item.findMany({
      where: { user_id: userId },
      include: {
        product: true
      }
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cart" });
  }
});

// Update the cart item by a user
router.put("/:userId/carts/:cartId", async (req, res) => {
  try {
    const { userId, cartId } = req.params;
    const { quantity } = req.body;

    const item = await prisma.billing_cart_item.findUnique({
      where: { id: cartId }
    });

    if (!item || item.user_id !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updated = await prisma.billing_cart_item.update({
      where: { id: cartId },
      data: { quantity }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update cart item" });
  }
});

// Delete the cart item by a user
router.delete("/:userId/carts/:cartId", async (req, res) => {
  try {
    const { userId, cartId } = req.params;

    const item = await prisma.billing_cart_item.findUnique({
      where: { id: cartId }
    });

    if (!item || item.user_id !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await prisma.billing_cart_item.delete({
      where: {
        id: cartId,
      }
    });

    res.json({ message: "Item removed" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove cart item" });
  }
});

//Creating the bill
router.post("/:userId/checkout", async (req, res) => {
  try {
    const { userId } = req.params;
    const { payment_method, discount = 0, tax = 0 } = req.body; 

    const cartItems = await prisma.billing_cart_item.findMany({
      where: { user_id: userId },
      include: { product: true },
    });

    if (!cartItems.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const sub_total = cartItems.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
    const total = sub_total + tax - discount;

    const invoice_number = `INV-${Date.now()}`;

    const bill = await prisma.billing.create({
      data: {
        user_id: userId,
        invoice_number,
        sub_total,
        tax,
        discount,
        total,
        payment_method,
      },
    });

    // Create billing items
    const billingItemsData = cartItems.map(item => ({
      billing_id: bill.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_time: item.product.price,
      total: item.quantity * item.product.price,
    }));

    await prisma.billing_item.createMany({ data: billingItemsData });

    await prisma.billing_cart_item.deleteMany({ where: { user_id: userId } });

    res.status(201).json({ message: "Checkout successful", bill });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to checkout" });
  }
});



export default router;