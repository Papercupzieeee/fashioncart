import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

// 1. IMPORT MODELS
import UserModel from "../modules/user/user.model.js";
import ProductModel from "../modules/product/product.model.js";
import CartModel from "../modules/cart/cart.model.js";
import WishlistModel from "../modules/wishlist/wishlist.model.js";
import OrderModel, { initOrderAssociations } from "../modules/order/order.model.js";
import OrderItemModel from "../modules/order/orderItem.model.js";

const db = {};

db.sequelize = sequelize;
db.Sequelize = sequelize.constructor; 

// 2. ASSIGN MODELS (Rule: Direct assignment for Class models)
db.User = UserModel;
db.Product = ProductModel;
db.Cart = CartModel;
db.Wishlist = WishlistModel;
db.Order = OrderModel;
db.OrderItem = OrderItemModel;

// 3. ASSOCIATIONS
initOrderAssociations(db);

db.Cart.belongsTo(db.Product, { foreignKey: 'productId' });
db.Product.hasMany(db.Cart, { foreignKey: 'productId' });

db.Wishlist.belongsTo(db.Product, { foreignKey: 'productId' });
db.Product.hasMany(db.Wishlist, { foreignKey: 'productId' });

export default db;