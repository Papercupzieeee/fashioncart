import db from "../../models/index.js";

export const createOrders = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { userId, items, cartItems } = req.body;
    const payloadItems = Array.isArray(items)
      ? items
      : Array.isArray(cartItems)
      ? cartItems
      : [];

    if (!userId || payloadItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "userId and items array are required",
      });
    }

    // Calculate total price
    const totalPrice = payloadItems.reduce((sum, item) => {
      const price = Number(item.price ?? item.unitPrice ?? item.product_price ?? 0);
      const quantity = Number(item.quantity) || 1;
      return sum + (price * quantity);
    }, 0);

    // 1. Create the Order
    const order = await db.Order.create({
      user_id: Number(userId),
      total_price: totalPrice,
      status: "Placed",
    }, { transaction });

    // 2. Create the OrderItems
    const orderItemsData = payloadItems.map((item) => {
      const productId = Number(item.product_id ?? item.productId ?? item.id);
      const price = Number(item.price ?? item.unitPrice ?? item.product_price);
      const quantity = Number(item.quantity) || 1;

      if (!productId || Number.isNaN(price)) {
        throw new Error("Invalid item data: productId and price are required");
      }

      return {
        order_id: order.id,
        product_id: productId,
        price,
        quantity,
      };
    });

    await db.OrderItem.bulkCreate(orderItemsData, { transaction });

    await transaction.commit();

    return res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

export const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const numericUserId = Number(userId);

    if (!numericUserId) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId parameter",
      });
    }

    const orders = await db.Order.findAll({
      where: { user_id: numericUserId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: db.OrderItem,
          as: "items",
          include: [
            {
              model: db.Product,
              as: "product",
              attributes: ["id", "name", "originalPrice", "image", "category"],
            }
          ]
        },
      ],
    });

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};
