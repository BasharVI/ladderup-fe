"use client";
import { io, Socket } from "socket.io-client";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8080";
let socket: Socket | null = null;

export function getSocket(userId: string) {
  if (socket && socket.connected) return socket;
  if (!socket)
    socket = io(WS_URL, {
      autoConnect: false,
      transports: ["websocket"],
      auth: { userId },
    });
  if (!socket.connected) socket.connect();
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
}
