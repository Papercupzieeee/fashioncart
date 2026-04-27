import React, { useEffect, useMemo, useState } from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "https://esm.sh/react-leaflet@4.2.1";
import { divIcon } from "https://esm.sh/leaflet@1.9.4";
import { io } from "https://esm.sh/socket.io-client@4.8.3";
import {
  SOCKET_EVENTS,
  STORE_LOCATION,
  getCurrentUser,
  getOrderIdFromUrl,
  resolveBackendBase,
} from "./trackingConfig.js";

const h = React.createElement;
const DEFAULT_USER_LOCATION = {
  lat: STORE_LOCATION.lat + 0.015,
  lng: STORE_LOCATION.lng + 0.015,
  label: "Your location",
};

const buildMarkerIcon = (type) =>
  divIcon({
    className: "",
    html: `<div class="tracking-marker ${type}"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });

const formatDateTime = (value) => {
  if (!value) return "Waiting for updates";
  return new Date(value).toLocaleString();
};

const FitMarkers = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;

    if (points.length === 1) {
      map.setView(points[0], 15, { animate: true });
      return;
    }

    map.fitBounds(points, { padding: [50, 50], animate: true });
  }, [map, JSON.stringify(points)]);

  return null;
};

const useAnimatedCoordinates = (target) => {
  const [displayValue, setDisplayValue] = useState(target);

  useEffect(() => {
    if (!target) {
      setDisplayValue(null);
      return undefined;
    }

    if (!displayValue) {
      setDisplayValue(target);
      return undefined;
    }

    const start = displayValue;
    const end = target;
    const startTime = performance.now();
    let animationFrameId = null;

    const animate = (now) => {
      const progress = Math.min((now - startTime) / 1200, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setDisplayValue({
        ...end,
        lat: start.lat + (end.lat - start.lat) * eased,
        lng: start.lng + (end.lng - start.lng) * eased,
      });

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [target?.lat, target?.lng, target?.timestamp]);

  return displayValue;
};

const TrackingApp = () => {
  const orderId = getOrderIdFromUrl();
  const currentUser = getCurrentUser();
  const userId = Number(currentUser?.id) || null;

  const [backendBase, setBackendBase] = useState("");
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [liveLocation, setLiveLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(DEFAULT_USER_LOCATION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [trackingEndedMessage, setTrackingEndedMessage] = useState("");

  const animatedRiderLocation = useAnimatedCoordinates(liveLocation);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          label: "Your location",
        });
      },
      () => {
        // Keep the fallback marker if geolocation is denied.
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  useEffect(() => {
    if (!orderId) {
      setError("Missing orderId. Open this page from the order list.");
      setLoading(false);
      return;
    }

    const loadOrder = async () => {
      setLoading(true);
      setError("");

      const query = userId ? `?userId=${userId}` : "";
      const base = await resolveBackendBase(`/api/orders/tracking/${orderId}${query}`);
      setBackendBase(base);

      try {
        const response = await fetch(`${base}/api/orders/tracking/${orderId}${query}`);
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(result.message || "Failed to load tracking details");
        }

        setOrder(result.data?.order || null);
        setStatus(result.data?.order?.status || "");
        setLiveLocation(result.data?.liveTracking || null);
      } catch (loadError) {
        setError(loadError.message || "Failed to load tracking details");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId, userId]);

  useEffect(() => {
    if (!backendBase || !orderId) return undefined;

    const socket = io(backendBase, {
      transports: ["websocket", "polling"],
    });

    socket.emit(SOCKET_EVENTS.subscribeOrder, { orderId });

    socket.on(SOCKET_EVENTS.liveLocation, (payload) => {
      setLiveLocation(payload);
      setTrackingEndedMessage("");
    });

    socket.on(SOCKET_EVENTS.orderStatusUpdated, (payload) => {
      if (payload?.status) setStatus(payload.status);
      if (payload?.order) setOrder(payload.order);
    });

    socket.on(SOCKET_EVENTS.trackingEnded, (payload) => {
      if (payload?.status) setStatus(payload.status);
      setTrackingEndedMessage(payload?.status === "Delivered"
        ? "Order delivered. Live tracking has ended."
        : "Live tracking has stopped for this order.");
    });

    return () => {
      socket.emit(SOCKET_EVENTS.unsubscribeOrder, { orderId });
      socket.disconnect();
    };
  }, [backendBase, orderId]);

  const mapPoints = useMemo(() => {
    const points = [[STORE_LOCATION.lat, STORE_LOCATION.lng], [userLocation.lat, userLocation.lng]];
    if (animatedRiderLocation) {
      points.push([animatedRiderLocation.lat, animatedRiderLocation.lng]);
    }
    return points;
  }, [animatedRiderLocation, userLocation]);

  if (loading) {
    return h("main", { className: "tracking-page" }, h("section", { className: "tracking-loading" }, "Loading tracking details..."));
  }

  if (error) {
    return h(
      "main",
      { className: "tracking-page" },
      h("section", { className: "tracking-error" }, [
        h("h1", { key: "title", className: "tracking-title" }, "Track Order"),
        h("p", { key: "body" }, error),
        h("a", { key: "back", className: "tracking-link", href: "orders.html" }, "Back to Orders"),
      ])
    );
  }

  const canTrackLive = status === "Out for Delivery";
  const statusClassName =
    status === "Delivered" ? "tracking-chip success" : canTrackLive ? "tracking-chip warning" : "tracking-chip";

  return h("main", { className: "tracking-page" }, [
    h("header", { key: "header", className: "tracking-topbar" }, [
      h("div", { key: "copy" }, [
        h("h1", { key: "title", className: "tracking-title" }, `Track Order #${order?.id || orderId}`),
        h("p", { key: "subtitle", className: "tracking-subtitle" }, "Swiggy-style live rider tracking powered by OpenStreetMap and Socket.IO."),
      ]),
      h("a", { key: "back", className: "tracking-link", href: "orders.html" }, "Back to Orders"),
    ]),
    h("section", { key: "grid", className: "tracking-grid" }, [
      h("div", { key: "mapCard", className: "tracking-card" }, [
        h("div", { key: "statusWrap", className: "tracking-inline" }, [
          h("span", { key: "status", className: statusClassName }, `Status: ${status || "Placed"}`),
          trackingEndedMessage
            ? h("span", { key: "ended", className: "tracking-chip success" }, trackingEndedMessage)
            : null,
        ]),
        canTrackLive
          ? h("div", { key: "map", className: "tracking-map" }, h(MapContainer, {
              center: [STORE_LOCATION.lat, STORE_LOCATION.lng],
              zoom: 14,
              style: { height: "100%", width: "100%" },
              children: [
                h(TileLayer, {
                  key: "tiles",
                  attribution: '&copy; OpenStreetMap contributors',
                  url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                }),
                h(FitMarkers, { key: "fit", points: mapPoints }),
                h(Marker, {
                  key: "store",
                  position: [STORE_LOCATION.lat, STORE_LOCATION.lng],
                  icon: buildMarkerIcon("store"),
                  children: h(Popup, null, STORE_LOCATION.label),
                }),
                h(Marker, {
                  key: "user",
                  position: [userLocation.lat, userLocation.lng],
                  icon: buildMarkerIcon("user"),
                  children: h(Popup, null, "Delivery destination"),
                }),
                animatedRiderLocation
                  ? h(Marker, {
                      key: "rider",
                      position: [animatedRiderLocation.lat, animatedRiderLocation.lng],
                      icon: buildMarkerIcon("rider"),
                      children: h(Popup, null, "Rider live location"),
                    })
                  : null,
                animatedRiderLocation
                  ? h(Polyline, {
                      key: "route",
                      positions: [
                        [STORE_LOCATION.lat, STORE_LOCATION.lng],
                        [animatedRiderLocation.lat, animatedRiderLocation.lng],
                        [userLocation.lat, userLocation.lng],
                      ],
                      pathOptions: { color: "#d97706", weight: 5, opacity: 0.7 },
                    })
                  : null,
              ],
            }))
          : h("div", { key: "waiting", className: "tracking-empty" }, [
              h("h2", { key: "title" }, "Live tracking is not active yet"),
              h(
                "p",
                { key: "text" },
                status === "Delivered"
                  ? "This order has already been delivered."
                  : "Tracking becomes available when the admin marks this order as Out for Delivery."
              ),
            ]),
      ]),
      h("aside", { key: "metaCard", className: "tracking-card tracking-meta" }, [
        h("h2", { key: "heading" }, "Tracking Details"),
        h("div", { key: "list", className: "tracking-list" }, [
          h("div", { key: "orderId", className: "tracking-row" }, [
            h("span", { key: "label", className: "tracking-label" }, "Order"),
            h("span", { key: "value", className: "tracking-value" }, `#${order?.id || orderId}`),
          ]),
          h("div", { key: "customer", className: "tracking-row" }, [
            h("span", { key: "label", className: "tracking-label" }, "Customer"),
            h("span", { key: "value", className: "tracking-value" }, order?.user?.name || currentUser?.name || "Customer"),
          ]),
          h("div", { key: "updated", className: "tracking-row" }, [
            h("span", { key: "label", className: "tracking-label" }, "Last update"),
            h("span", { key: "value", className: "tracking-value" }, formatDateTime(animatedRiderLocation?.timestamp)),
          ]),
          h("div", { key: "store", className: "tracking-row" }, [
            h("span", { key: "label", className: "tracking-label" }, "Store marker"),
            h("span", { key: "value", className: "tracking-value" }, `${STORE_LOCATION.lat.toFixed(4)}, ${STORE_LOCATION.lng.toFixed(4)}`),
          ]),
          h("div", { key: "userLocation", className: "tracking-row" }, [
            h("span", { key: "label", className: "tracking-label" }, "User marker"),
            h("span", { key: "value", className: "tracking-value" }, `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`),
          ]),
          h("div", { key: "riderLocation", className: "tracking-row" }, [
            h("span", { key: "label", className: "tracking-label" }, "Rider marker"),
            h(
              "span",
              { key: "value", className: "tracking-value" },
              animatedRiderLocation ? `${animatedRiderLocation.lat.toFixed(4)}, ${animatedRiderLocation.lng.toFixed(4)}` : "Waiting..."
            ),
          ]),
        ]),
      ]),
    ]),
  ]);
};

const rootElement = document.getElementById("tracking-root");
if (rootElement) {
  createRoot(rootElement).render(h(TrackingApp));
}
