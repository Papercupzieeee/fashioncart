import Product from "./product.model.js";

/* ---------------- HELPER: VALIDATE PRODUCT ---------------- */
const validateProduct = (product) => {
  const errors = [];
  if (!product.name || product.name.trim().length < 2) {
    errors.push("Name is required and must be at least 2 characters.");
  }
  if (product.price === undefined || product.price === null || isNaN(Number(product.price)) || Number(product.price) < 0) {
    errors.push("Price is required and must be a non-negative number.");
  }
  return errors;
};

/* ---------------- CREATE PRODUCT ---------------- */
export const createProduct = async (req, res, next) => {
  try {
    const payload = { ...req.body };

    if (req.file) {
      payload.image = req.file.filename;
    }

    if (!payload || Object.keys(payload).length === 0) {
      return res.status(400).json({ success: false, message: "Request body cannot be empty." });
    }

    const validationErrors = validateProduct(payload);
    if (validationErrors.length > 0) {
      return res.status(400).json({ success: false, errors: validationErrors });
    }

    const product = await Product.create(payload);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

/* ---------------- GET ALL PRODUCTS ---------------- */
export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({ order: [['id', 'DESC']] });
    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    next(err);
  }
};

/* ---------------- GET SINGLE PRODUCT ---------------- */
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

/* ---------------- UPDATE PRODUCT ---------------- */
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    const payload = { ...req.body };
    if (req.file) {
      payload.image = req.file.filename;
    }

    await product.update(payload);
    res.json({ success: true, message: "Product updated successfully.", data: product });
  } catch (err) {
    next(err);
  }
};

/* ---------------- DELETE PRODUCT ---------------- */
export const deleteProduct = async (req, res, next) => {
  try {
    const deleted = await Product.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }
    res.json({ success: true, message: "Product deleted successfully." });
  } catch (err) {
    next(err);
  }
};

/* ---------------- UPDATE STOCK ---------------- */
export const updateStock = async (req, res, next) => {
  try {
    const { stock } = req.body;
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }
    await product.update({ stock });
    res.json({ success: true, message: "Stock updated successfully.", data: product });
  } catch (err) {
    next(err);
  }
};

/* ---------------- UPDATE DISCOUNT ---------------- */
export const updateDiscount = async (req, res, next) => {
  try {
    const { discount } = req.body;
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }
    await product.update({ discount });
    res.json({ success: true, message: "Discount updated successfully.", data: product });
  } catch (err) {
    next(err);
  }
};