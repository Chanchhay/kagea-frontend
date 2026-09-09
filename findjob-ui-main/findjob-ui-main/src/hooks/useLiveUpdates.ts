"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useAppDispatch } from "@/store/hooks";
import { baseApi } from "@/services/baseApi";
import { isUuid } from "@/lib/uuid";

export type LiveStatus = "connecting" | "connected" | "reconnecting";

let status: LiveStatus = "connecting";
const statusListeners = new Set<() => void>();

function setStatus(value: LiveStatus) {
  status = value;
  statusListeners.forEach((listener) => listener());
}

const subscribeStatus = (listener: () => void) => {
  statusListeners.add(listener);
  return () => {
    statusListeners.delete(listener);
  };
};

export function useLiveStatus() {
  return useSyncExternalStore(
    subscribeStatus,
    () => status,
    () => "connecting" as LiveStatus,
  );
}

type Dispatcher = ReturnType<typeof useAppDispatch>;
const dispatchers = new Set<Dispatcher>();
let socket: WebSocket | undefined;
let retryTimer: ReturnType<typeof setTimeout> | undefined;
let watchdogInterval: ReturnType<typeof setInterval> | undefined;
let attempt = 0;
let lastSeen = Date.now();
let activeSubscribers = 0;

function broadcast(action: Parameters<Dispatcher>[0]) {
  dispatchers.forEach((dispatch) => {
    try {
      dispatch(action);
    } catch {
      /* Ignore dispatch failures if subscriber unmounted */
    }
  });
}

function refreshAll() {
  broadcast(
    baseApi.util.invalidateTags([
      "Notifications",
      "UnreadCount",
      "Conversations",
      "Messages",
    ]),
  );
}

function connectSocket() {
  if (activeSubscribers <= 0 || typeof window === "undefined") return;

  setStatus(attempt ? "reconnecting" : "connecting");

  try {
    const url = new URL("/api/v1/notifications/ws", window.location.href);
    url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
    socket = new WebSocket(url);
  } catch {
    scheduleReconnect();
    return;
  }

  lastSeen = Date.now();

  socket.onmessage = (event) => {
    lastSeen = Date.now();
    try {
      const payload = JSON.parse(event.data);
      if (payload.type === "connected") {
        attempt = 0;
        setStatus("connected");
        refreshAll();
      } else if (payload.type === "notification") {
        broadcast(
          baseApi.util.invalidateTags(["Notifications", "UnreadCount"]),
        );
      } else if (payload.type === "message") {
        const id = payload.data?.conversationId;
        broadcast(
          baseApi.util.invalidateTags([
            "Conversations",
            typeof id === "string" && isUuid(id)
              ? { type: "Messages", id }
              : "Messages",
          ]),
        );
      }
    } catch {
      /* Ignore malformed events; reconnect also resynchronizes. */
    }
  };

  socket.onerror = () => {
    socket?.close();
  };

  socket.onclose = () => {
    socket = undefined;
    if (activeSubscribers <= 0) return;
    setStatus("reconnecting");
    scheduleReconnect();
  };
}

function scheduleReconnect() {
  clearTimeout(retryTimer);
  retryTimer = setTimeout(
    () => {
      connectSocket();
    },
    Math.min(30000, 1000 * 2 ** Math.min(attempt++, 5)) + Math.random() * 500,
  );
}

function onVisibilityChange() {
  if (document.visibilityState === "visible") {
    refreshAll();
    if (Date.now() - lastSeen > 60000) {
      socket?.close();
    }
  }
}

/**
 * One authenticated WebSocket owned by the app shell. Re-reads after reconnect
 * so a lost event never leaves the inbox stale. Tokens remain in the gateway.
 */
export function useLiveUpdates(enabled: boolean = true) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    dispatchers.add(dispatch);
    activeSubscribers++;

    if (activeSubscribers === 1) {
      attempt = 0;
      connectSocket();
      watchdogInterval = setInterval(() => {
        if (Date.now() - lastSeen > 60000) {
          socket?.close();
        }
      }, 15000);
      document.addEventListener("visibilitychange", onVisibilityChange);
    }

    return () => {
      dispatchers.delete(dispatch);
      activeSubscribers--;

      if (activeSubscribers === 0) {
        clearTimeout(retryTimer);
        clearInterval(watchdogInterval);
        document.removeEventListener("visibilitychange", onVisibilityChange);
        socket?.close();
        socket = undefined;
        setStatus("connecting");
      }
    };
  }, [dispatch, enabled]);
}
