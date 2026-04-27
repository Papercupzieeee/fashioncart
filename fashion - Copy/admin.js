/* ================= CONFIG ================= */
const API_BASE = "http://localhost:5000";
const TOKEN_KEY = "token";
const USER_KEY = "user";

const state = {
  products: [],
  editingProductId: null,
};

/* ================= ELEMENTS ================= */
const adminAuthCard = document.getElementById("adminAuthCard");
const adminDashboard = document.getElementById("adminDashboard");
const adminWelcome = document.getElementById("adminWelcome");
const loginForm = document.getElementById("adminLoginForm");
const loginError = document.getElementById("loginError");
const loginSuccess = document.getElementById("loginSuccess");
const logoutButton = document.getElementById("logoutButton");

const productForm = document.getElementById("productForm");
const productFormTitle = document.getElementById("productFormTitle");
const productSubmitButton = document.getElementById("productSubmitButton");
const cancelEditButton = document.getElementById("cancelEditButton");
const productError = document.getElementById("productError");
const productSuccess = document.getElementById("productSuccess");
const productIdField = document.getElementById("productId");

const inventoryTableBody = document.getElementById("inventoryTableBody");
const inventoryError = document.getElementById("inventoryError");
const refreshProductsButton = document.getElementById("refreshProductsButton");

/* ================= HELPERS ================= */
const getToken = () => localStorage.getItem(TOKEN_KEY);
const getSessionUser = () => {
  try {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch (_e) {
    return null;
  }
};
const isAdminRole = (role) => role === "admin" || role === "superadmin";

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const resetFeedback = () => {
  if (productError) productError.textContent = "";
  if (productSuccess) productSuccess.textContent = "";
};

const adminFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = { ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || data.error || "Request failed");
  }
  return data;
};

const toFormData = (formElement) => {
  const formData = new FormData();
  const getValue = (id) => document.getElementById(id)?.value ?? "";

  formData.append("name", getValue("name").trim());
  formData.append("brand", getValue("brand").trim());
  formData.append("originalPrice", getValue("originalPrice").trim());
  formData.append("category", getValue("category").trim());
  formData.append("stock", getValue("stock").trim());
  formData.append("discount", getValue("discount").trim() || "0");
  formData.append("description", getValue("description").trim());

  const imageInput = document.getElementById("image");
  const imageFile = imageInput?.files?.[0];
  if (imageFile) {
    formData.append("image", imageFile);
  }

  return formData;
};

const renderInventory = () => {
  if (!inventoryTableBody) return;

  if (!state.products.length) {
    inventoryTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="placeholder">No products found in database.</td>
      </tr>
    `;
    return;
  }

  inventoryTableBody.innerHTML = state.products
    .map((product) => {
      const name = escapeHtml(product.name || "Unnamed product");
      const category = escapeHtml(product.category || "-");
      const originalPrice = Number(product.originalPrice || 0);
      const stock = Number(product.stock || 0);
      const discount = Number(product.discount || 0);
      return `
        <tr>
          <td>${name}</td>
          <td>${category}</td>
          <td>₹${originalPrice}</td>
          <td>${stock}</td>
          <td>${discount}%</td>
          <td>
            <button type="button" class="btn btn-ghost inventory-action" data-action="edit" data-id="${product.id}">Edit</button>
            <button type="button" class="btn btn-secondary inventory-action" data-action="discount" data-id="${product.id}">Update Discount</button>
            <button type="button" class="btn btn-danger inventory-action" data-action="delete" data-id="${product.id}">Delete</button>
          </td>
        </tr>
      `;
    })
    .join("");
};

const loadProducts = async () => {
  if (inventoryError) inventoryError.textContent = "";
  try {
    const result = await adminFetch("/api/products");
    state.products = Array.isArray(result.data) ? result.data : [];
    renderInventory();
  } catch (error) {
    if (inventoryError) inventoryError.textContent = error.message;
  }
};

const enterEditMode = (productId) => {
  const product = state.products.find((item) => Number(item.id) === Number(productId));
  if (!product || !productForm) return;

  state.editingProductId = product.id;
  if (productIdField) productIdField.value = String(product.id);
  document.getElementById("name").value = product.name || "";
  document.getElementById("brand").value = product.brand || "";
  document.getElementById("originalPrice").value = Number(product.originalPrice || 0);
  document.getElementById("category").value = product.category || "";
  document.getElementById("stock").value = Number(product.stock || 0);
  document.getElementById("discount").value = Number(product.discount || 0);
  document.getElementById("description").value = product.description || "";

  if (productFormTitle) productFormTitle.textContent = "Edit product";
  if (productSubmitButton) productSubmitButton.textContent = "Update product";
  if (cancelEditButton) cancelEditButton.classList.remove("hidden");
  resetFeedback();
  productForm.scrollIntoView({ behavior: "smooth", block: "start" });
};

const exitEditMode = () => {
  state.editingProductId = null;
  if (productIdField) productIdField.value = "";
  productForm?.reset();
  if (productFormTitle) productFormTitle.textContent = "Add product";
  if (productSubmitButton) productSubmitButton.textContent = "Add product";
  if (cancelEditButton) cancelEditButton.classList.add("hidden");
  resetFeedback();
};

const deleteProduct = async (productId) => {
  if (!window.confirm("Delete this product?")) return;
  try {
    await adminFetch(`/api/products/${productId}`, { method: "DELETE" });
    if (productSuccess) productSuccess.textContent = "Product deleted successfully.";
    if (state.editingProductId === Number(productId)) {
      exitEditMode();
    }
    await loadProducts();
  } catch (error) {
    if (inventoryError) inventoryError.textContent = error.message;
  }
};

const updateDiscount = async (productId) => {
  const value = window.prompt("Enter discount (0-100):");
  if (value === null) return;
  const discount = Number(value);
  if (Number.isNaN(discount) || discount < 0 || discount > 100) {
    window.alert("Please enter a valid discount from 0 to 100.");
    return;
  }

  try {
    await adminFetch(`/api/products/${productId}/discount`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ discount }),
    });
    if (productSuccess) productSuccess.textContent = "Discount updated successfully.";
    await loadProducts();
  } catch (error) {
    if (inventoryError) inventoryError.textContent = error.message;
  }
};

const onInventoryActionClick = async (event) => {
  const button = event.target.closest(".inventory-action");
  if (!button) return;

  const action = button.dataset.action;
  const productId = Number(button.dataset.id);
  if (!action || Number.isNaN(productId)) return;

  if (action === "edit") {
    enterEditMode(productId);
    return;
  }
  if (action === "delete") {
    await deleteProduct(productId);
    return;
  }
  if (action === "discount") {
    await updateDiscount(productId);
  }
};

const saveProduct = async (event) => {
  event.preventDefault();
  if (!productForm) return;

  resetFeedback();
  if (productSuccess) productSuccess.textContent = state.editingProductId ? "Updating product..." : "Adding product...";

  try {
    const payload = toFormData(productForm);
    const wasEditing = Boolean(state.editingProductId);
    if (state.editingProductId) {
      await adminFetch(`/api/products/${state.editingProductId}`, {
        method: "PUT",
        body: payload,
      });
      if (productSuccess) productSuccess.textContent = "Product updated successfully.";
    } else {
      await adminFetch("/api/products", {
        method: "POST",
        body: payload,
      });
      if (productSuccess) productSuccess.textContent = "Product added successfully.";
    }

    exitEditMode();
    if (productSuccess) {
      productSuccess.textContent = wasEditing
        ? "Product updated successfully."
        : "Product added successfully.";
    }
    await loadProducts();
  } catch (error) {
    if (productSuccess) productSuccess.textContent = "";
    if (productError) productError.textContent = error.message;
  }
};

const showDashboard = async (user) => {
  if (adminAuthCard) adminAuthCard.classList.add("hidden");
  if (adminDashboard) adminDashboard.classList.remove("hidden");
  if (adminWelcome) {
    adminWelcome.textContent = `Signed in as ${user.name || user.email || "admin"} (${user.role})`;
  }
  await loadProducts();
};

const handleLogin = async (event) => {
  event.preventDefault();
  if (loginError) loginError.textContent = "";
  if (loginSuccess) loginSuccess.textContent = "";

  try {
    const email = (document.getElementById("adminUsername")?.value || "").trim();
    const password = document.getElementById("adminPassword")?.value || "";
    const result = await adminFetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const user = result?.user;
    if (!user || !isAdminRole(user.role) || !result.token) {
      throw new Error("Only admin accounts can access this page.");
    }

    localStorage.setItem(TOKEN_KEY, result.token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    if (loginSuccess) loginSuccess.textContent = "Login successful.";
    await showDashboard(user);
  } catch (error) {
    if (loginError) loginError.textContent = error.message;
  }
};

const handleLogout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.location.reload();
};

/* ================= BOOTSTRAP ================= */
loginForm?.addEventListener("submit", handleLogin);
logoutButton?.addEventListener("click", handleLogout);
productForm?.addEventListener("submit", saveProduct);
cancelEditButton?.addEventListener("click", exitEditMode);
refreshProductsButton?.addEventListener("click", loadProducts);
inventoryTableBody?.addEventListener("click", onInventoryActionClick);

const sessionUser = getSessionUser();
if (sessionUser && getToken() && isAdminRole(sessionUser.role)) {
  showDashboard(sessionUser);
}
