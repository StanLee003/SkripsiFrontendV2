// src/utils/socket.js
import { io } from "socket.io-client";
import { BACKEND_URL } from "../backend";

const socket = io(BACKEND_URL, {
  autoConnect: true,
  transports: ["websocket"],
});

export default socket;
