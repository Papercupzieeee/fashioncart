import {
  createAuthHeaders,
  getCurrentToken,
  resolveBackendBase,
} from "./trackingConfig.js";

const root = document.getElementById("admin-deliveries-root");

const render = (html) => {
  if (root) root.innerHTML = html;
};

const formatMoney = (value) => `Rs ${Number(value || 0).toFixed(2)}`;

const getStatusChipClass = (status) => {
  if (status === "Delivered") return "tracking-chip success";
  if (status === "Out for Delivery") return "tracking-chip warning";
  return "tracking-chip";
};

const bootstrap = async () => {
  if (!getCurrentToken()) {
    render(`
      <main class="tracking-page">
        <section class="tracking-error">
          <h1 class="tracking-title">Delivery Dashboard</h1>
          <p>Please sign in on the admin page first.</p>
          <a class="tracking-link" href="admin.html">Go to Admin Login</a>
        </section>
      </main>
    `);
    return;
  }

  render(`
    <main class="tracking-page">
      <section class="tracking-loading">Loading delivery orders...</section>
    </main>
  `);

  const headers = createAuthHeaders();
  const backendBase = await resolveBackendBase("/api/orders/admin/list", { headers });

  const fetchOrders = async () => {
    const response = await fetch(`${backendBase}/api/orders/admin/list`, { headers });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(result.message || "Failed to load delivery orders");
    }
    return Array.isArray(result.data) ? result.data : [];
  };

  const updateStatus = async (orderId, status) => {
    const response = await fetch(`${backendBase}/api/orders/admin/${orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify({ status }),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(result.message || "Failed to update order status");
    }
  };

  const renderOrders = async () => {
    try {
      const orders = await fetchOrders();

      render(`
        <main class="tracking-page">
          <header class="tracking-topbar">
            <div>
              <h1 class="tracking-title">Delivery Dashboard</h1>
              <p class="tracking-subtitle">Mark orders Out for Delivery, open the rider console, and finish deliveries without changing your existing order flow.</p>
            </div>
            <div class="tracking-inline">
              <a class="tracking-link" href="admin.html">Admin Home</a>
              <button class="tracking-button secondary" id="refreshDeliveries" type="button">Refresh</button>
            </div>
          </header>
          <section class="tracking-order-list">
            ${
              orders.length
                ? orders
                    .map((order) => `
                      <article class="tracking-order-card">
                        <div class="tracking-inline">
                          <span class="${getStatusChipClass(order.status)}">${order.status}</span>
                          <strong>Order #${order.id}</strong>
                          <span class="tracking-subtitle">${order.user?.name || "Customer"}${order.user?.email ? ` • ${order.user.email}` : ""}</span>
                        </div>
                        <div class="tracking-order-items">
                          ${(order.items || [])
                            .map(
                              (item) => `
                                <div class="tracking-row">
                                  <span>${item.product?.name || `Product #${item.product_id}`} x ${item.quantity}</span>
                                  <span class="tracking-value">${formatMoney(item.price)}</span>
                                </div>
                              `
                            )
                            .join("")}
                        </div>
                        <div class="tracking-inline">
                          <span class="tracking-label">Total</span>
                          <span class="tracking-value">${formatMoney(order.total_price)}</span>
                        </div>
                        <div class="tracking-order-actions">
                          <button class="tracking-button" data-action="status" data-order-id="${order.id}" data-status="Out for Delivery" ${order.status === "Out for Delivery" ? "disabled" : ""}>Mark Out for Delivery</button>
                          <button class="tracking-button secondary" data-action="rider" data-order-id="${order.id}" ${order.status !== "Out for Delivery" ? "disabled" : ""}>Open Rider Console</button>
                          <button class="tracking-button danger" data-action="status" data-order-id="${order.id}" data-status="Delivered" ${order.status === "Delivered" ? "disabled" : ""}>Mark Delivered</button>
                        </div>
                      </article>
                    `)
                    .join("")
                : '<section class="tracking-empty"><h2>No orders yet</h2><p>Orders will appear here once customers start placing them.</p></section>'
            }
          </section>
        </main>
      `);

      document.getElementById("refreshDeliveries")?.addEventListener("click", renderOrders);

      root?.querySelectorAll("[data-action='status']").forEach((button) => {
        button.addEventListener("click", async () => {
          button.setAttribute("disabled", "disabled");
          try {
            await updateStatus(button.dataset.orderId, button.dataset.status);
            await renderOrders();
          } catch (error) {
            window.alert(error.message || "Failed to update order status");
            button.removeAttribute("disabled");
          }
        });
      });

      root?.querySelectorAll("[data-action='rider']").forEach((button) => {
        button.addEventListener("click", () => {
          window.location.href = `rider.html?orderId=${button.dataset.orderId}`;
        });
      });
    } catch (error) {
      render(`
        <main class="tracking-page">
          <section class="tracking-error">
            <h1 class="tracking-title">Delivery Dashboard</h1>
            <p>${error.message || "Failed to load delivery orders."}</p>
            <a class="tracking-link" href="admin.html">Back to Admin</a>
          </section>
        </main>
      `);
    }
  };

  await renderOrders();
};

bootstrap();
