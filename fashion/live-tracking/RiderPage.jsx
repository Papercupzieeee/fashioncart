import React, { useEffect, useRef, useState } from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";
import { io } from "https://esm.sh/socket.io-client@4.8.3";
import {
  SOCKET_EVENTS,
  TRACKING_INTERVAL_MS,
  getCurrentUser,
  getOrderIdFromUrl,
  resolveBackendBase,
} from "./trackingConfig.js";

const h = React.createElement;

const RiderApp = () => {
  const orderId = getOrderIdFromUrl();
  const currentUser = getCurrentUser();
  const [backendBase, setBackendBase] = useState("");
  const [order, setOrder] = useState(null);
  const [coords, setCoords] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const socketRef = useRef(null);
  const watchIdRef = useRef(null);
  const lastSentRef = useRef(0);

  useEffect(() => {
    if (!orderId) {
      setError("Missing orderId. Open the rider page from the delivery dashboard.");
      return;
    }

    const loadOrder = async () => {
      const base = await resolveBackendBase(`/api/orders/tracking/${orderId}`);
      setBackendBase(base);

      try {
        const response = await fetch(`${base}/api/orders/tracking/${orderId}`);
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(result.message || "Failed to load order");
        }

        setOrder(result.data?.order || null);
      } catch (loadError) {
        setError(loadError.message || "Failed to load order");
      }
    };

    loadOrder();
  }, [orderId]);

  useEffect(() => () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  }, []);

  const ensureSocketConnection = () => {
    if (socketRef.current || !backendBase) return socketRef.current;

    socketRef.current = io(backendBase, {
      transports: ["websocket", "polling"],
    });

    socketRef.current.emit(SOCKET_EVENTS.subscribeOrder, { orderId });
    socketRef.current.on(SOCKET_EVENTS.orderStatusUpdated, (payload) => {
      if (payload?.order) setOrder(payload.order);
      if (payload?.status === "Delivered") {
        stopDelivery("Order delivered. Live tracking stopped.");
      }
    });

    return socketRef.current;
  };

  const stopDelivery = (customMessage = "Live location sharing stopped.") => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (socketRef.current) {
      socketRef.current.emit(SOCKET_EVENTS.deliveryStopped, {
        orderId,
        status: order?.status || "Stopped",
      });
    }

    setIsSending(false);
    setMessage(customMessage);
  };

  const startDelivery = () => {
    if (order?.status !== "Out for Delivery") {
      setError("This order must be marked Out for Delivery before the rider can start tracking.");
      return;
    }

    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }

    setError("");
    setMessage("Waiting for accurate rider coordinates...");
    const socket = ensureSocketConnection();

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const nextCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: new Date().toISOString(),
        };

        setCoords(nextCoords);

        const now = Date.now();
        if (now - lastSentRef.current < TRACKING_INTERVAL_MS) {
          return;
        }

        lastSentRef.current = now;
        socket?.emit(SOCKET_EVENTS.riderLocation, {
          orderId,
          riderId: currentUser?.id || currentUser?.email || `rider-${orderId}`,
          ...nextCoords,
        });

        setIsSending(true);
        setMessage("Live location is being sent to the customer.");
      },
      (positionError) => {
        setError(positionError.message || "Failed to access rider GPS.");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000,
      }
    );
  };

  if (error) {
    return h("main", { className: "tracking-page" }, h("section", { className: "tracking-error" }, [
      h("h1", { key: "title", className: "tracking-title" }, "Rider Console"),
      h("p", { key: "message" }, error),
      h("a", { key: "back", className: "tracking-link", href: "admin-deliveries.html" }, "Back to Delivery Dashboard"),
    ]));
  }

  return h("main", { className: "tracking-page" }, [
    h("header", { key: "header", className: "tracking-topbar" }, [
      h("div", { key: "copy" }, [
        h("h1", { key: "title", className: "tracking-title" }, `Rider Console: Order #${order?.id || orderId || ""}`),
        h("p", { key: "subtitle", className: "tracking-subtitle" }, "Use your device GPS to send live delivery coordinates every 4 seconds."),
      ]),
      h("a", { key: "back", className: "tracking-link", href: "admin-deliveries.html" }, "Delivery Dashboard"),
    ]),
    h("section", { key: "panel", className: "tracking-grid" }, [
      h("div", { key: "controls", className: "tracking-card" }, [
        h("h2", { key: "heading" }, "Delivery Controls"),
        h("div", { key: "buttons", className: "tracking-order-actions" }, [
          h(
            "button",
            {
              key: "start",
              className: "tracking-button",
              onClick: startDelivery,
              disabled: isSending || order?.status !== "Out for Delivery",
            },
            "Start Delivery"
          ),
          h(
            "button",
            {
              key: "stop",
              className: "tracking-button danger",
              onClick: () => stopDelivery(),
              disabled: !isSending,
            },
            "Stop Delivery"
          ),
        ]),
        h("div", { key: "status", className: "tracking-inline", style: { marginTop: "16px" } }, [
          h(
            "span",
            {
              key: "chip",
              className: isSending ? "tracking-chip success" : "tracking-chip",
            },
            isSending ? "GPS Broadcasting Active" : `Order status: ${order?.status || "Placed"}`
          ),
        ]),
        message ? h("p", { key: "message", className: "tracking-subtitle" }, message) : null,
      ]),
      h("aside", { key: "coords", className: "tracking-card tracking-meta" }, [
        h("h3", { key: "title" }, "Current Coordinates"),
        coords
          ? h("div", { key: "value", className: "tracking-coords" }, [
              h("div", { key: "lat" }, `lat: ${coords.lat.toFixed(6)}`),
              h("div", { key: "lng" }, `lng: ${coords.lng.toFixed(6)}`),
              h("div", { key: "time" }, `updated: ${new Date(coords.timestamp).toLocaleTimeString()}`),
            ])
          : h("p", { key: "empty", className: "tracking-subtitle" }, "Coordinates will appear here once GPS starts."),
      ]),
    ]),
  ]);
};

const rootElement = document.getElementById("rider-root");
if (rootElement) {
  createRoot(rootElement).render(h(RiderApp));
}
