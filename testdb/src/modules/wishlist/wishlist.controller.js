import db from "../../models/index.js";

// TOGGLE WISHLIST (ADD / REMOVE)
export const toggleWishlist = async (req, res) => {
  try {
    // Handle both camelCase and snake_case from frontend
    const userId = req.body.userId || req.body.user_id;
    const productId = req.body.productId || req.body.product_id;

    if (!userId || !productId) {
      return res.status(400).json({ 
        success: false, 
        message: "userId and productId are required" 
      });
    }

    const existing = await db.Wishlist.findOne({
      where: { userId, productId },
    });

    if (existing) {
      await existing.destroy();
      return res.json({ 
        success: true, 
        message: "Removed from wishlist",
        isWishlisted: false 
      });
    }

    const item = await db.Wishlist.create({
      userId,
      productId,
    });

    res.status(201).json({ 
      success: true, 
      message: "Added to wishlist",
      data: item,
      isWishlisted: true
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET WISHLIST
export const getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    const data = await db.Wishlist.findAll({
      where: { userId },
      include: [
        {
          model: db.Product,
          attributes: ["id", "name", "originalPrice", "image", "category", "brand"],
        }
      ],
    });

    res.json({
      success: true,
      data: data
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};