"use client";

import { io } from "socket.io-client";

export const socket = io("http://localhost:8081", {
  withCredentials: true,
});
