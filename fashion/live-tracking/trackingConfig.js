export const STORE_LOCATION = {
  lat: 12.9716,
  lng: 77.5946,
  label: "F@shionc@rt Store",
};

export const TRACKING_INTERVAL_MS = 4000;

export const SOCKET_EVENTS = {
  subscribeOrder: "subscribe-order",
  unsubscribeOrder: "unsubscribe-order",
  riderLocation: "rider-location",
  deliveryStopped: "delivery-stopped",
  liveLocation: "live-location",
  orderStatusUpdated: "order-status-updated",
  trackingEnded: "tracking-ended",
};

export const getCurrentUser = () => {
  try {
    const value = window.localStorage.getItem("user");
    return value ? JSON.parse(value) : null;
  } catch (_error) {
    return null;
  }
};

export const getCurrentToken = () => window.localStorage.getItem("token");

export const getOrderIdFromUrl = () => {
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  const pathOrderId = Number(pathParts[pathParts.length - 1]);
  if (pathOrderId) return pathOrderId;

  const params = new URLSearchParams(window.location.search);
  return Number(params.get("orderId")) || null;
};

export const getBackendCandidates = () => {
  const candidates = [window.location.origin, "http://localhost:5000", "http://localhost:5001"];
  return [...new Set(candidates.filter(Boolean))];
};

export const resolveBackendBase = async (probePath, options = {}) => {
  const candidates = getBackendCandidates();

  for (const base of candidates) {
    try {
      const response = await fetch(`${base}${probePath}`, options);
      if (response.status !== 404) {
        return base;
      }
    } catch (_error) {
      // Keep probing candidates.
    }
  }

  return candidates[0];
};

export const createAuthHeaders = () => {
  const token = getCurrentToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
