import db from "../../models/index.js";

// ADD TO CART (Handles duplicates by increasing quantity)
export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const qty = Number(quantity) || 1;

    if (!userId || !productId) {
      return res.status(400).json({ error: "userId and productId are required" });
    }

    const existing = await db.Cart.findOne({
      where: { userId, productId },
    });

    if (existing) {
      existing.quantity += qty;
      await existing.save();
      return res.json({ 
        success: true,
        message: "Quantity updated in cart",
        data: existing 
      });
    }

    const cart = await db.Cart.create({
      userId,
      productId,
      quantity: qty,
    });

    res.status(201).json({
      success: true,
      message: "Added to cart",
      data: cart
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET CART
export const getCart = async (req, res) => {
  try {
    const cart = await db.Cart.findAll({
      where: { userId: req.params.userId },
      include: [
        {
          model: db.Product,
          attributes: ["id", "name", "originalPrice", "image", "category", "brand"],
        },
      ],
    });

    res.json({
      success: true,
      data: cart
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// DECREASE / UPDATE QUANTITY
export const decreaseCart = async (req, res) => {
  try {
    const item = await db.Cart.findByPk(req.params.id);

    if (!item) return res.status(404).json({ message: "Cart item not found" });

    if (item.quantity > 1) {
      item.quantity -= 1;
      await item.save();
    } else {
      await item.destroy();
    }

    res.json({ success: true, message: "Cart updated" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// REMOVE
export const removeCart = async (req, res) => {
  try {
    const deleted = await db.Cart.destroy({
      where: { id: req.params.id },
    });
    
    if (!deleted) return res.status(404).json({ message: "Item not found" });

    res.json({ success: true, message: "Removed from cart" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};