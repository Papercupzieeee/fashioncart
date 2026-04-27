import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 255],
    },
  },

  brand: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [0, 255],
    },
  },

  originalPrice: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      isFloat: true,
      min: 0,
    },
  },

  discount: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0,
    validate: {
      isFloat: true,
      min: 0,
      max: 100,
    },
  },

  rating: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      isFloat: true,
      min: 0,
      max: 5,
    },
  },

  reviews: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 2000],
    },
  },

  image: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [0, 1024],
    },
  },
  price: {
  type: DataTypes.FLOAT,
  allowNull: false,
  validate: {
    isFloat: true,
    min: 0,
  },
},

  category: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [0, 128],
    },
  },

  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  },
});

export default Product;