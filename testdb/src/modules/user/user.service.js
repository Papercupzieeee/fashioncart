import User from "./user.model.js";

const createUser = async (data) => {
  return await User.create(data);
};

const getAllUsers = async () => {
  return await User.findAll();
};

const getUserById = async (id) => {
  return await User.findByPk(id);
};

const updateUser = async (id, data) => {
  await User.update(data, { where: { id } });
  return { message: "User updated ✅" };
};

const deleteUser = async (id) => {
  await User.destroy({ where: { id } });
  return { message: "User deleted 🗑️" };
};
const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });

  if (!user) return null;

  if (user.password !== password) return null;

  return user;
};

export default {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
};