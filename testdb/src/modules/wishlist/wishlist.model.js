import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const Wishlist = sequelize.define("Wishlist", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, { 
  tableName: "wishlists",
  timestamps: false 
});

export default Wishlist;