import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Placed",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "orders",
    timestamps: true, // Good practice for orders
  }
);

export const initOrderAssociations = ({ User, Product, OrderItem }) => {
  if (User) {
    User.hasMany(Order, { foreignKey: "user_id", as: "orders" });
    Order.belongsTo(User, { foreignKey: "user_id", as: "user" });
  }

  if (Order && OrderItem) {
    Order.hasMany(OrderItem, { foreignKey: "order_id", as: "items" });
    OrderItem.belongsTo(Order, { foreignKey: "order_id" });
  }
  
  if (Product && OrderItem) {
    Product.hasMany(OrderItem, { foreignKey: "product_id" });
    OrderItem.belongsTo(Product, { foreignKey: "product_id", as: "product" });
  }
};

export default Order;
