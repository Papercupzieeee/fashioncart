import { DataTypes } from "sequelize";
import bcrypt from "bcryptjs";
import { sequelize } from "../../config/db.js";

const Admin = sequelize.define(
  "Admin",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [3, 50],
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "admin",
      validate: {
        isIn: [["admin"]],
      },
    },
  },
  {
    tableName: "admins",
  }
);

Admin.beforeCreate(async (admin) => {
  if (admin.password) {
    admin.password = await bcrypt.hash(admin.password, 12);
  }
});

Admin.beforeUpdate(async (admin) => {
  if (admin.changed("password")) {
    admin.password = await bcrypt.hash(admin.password, 12);
  }
});

Admin.prototype.checkPassword = async function checkPassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default Admin;
