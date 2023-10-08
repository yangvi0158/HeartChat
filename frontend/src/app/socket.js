import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  // eslint-disable-next-line no-undef
  process.env.NODE_ENV === "production" ? '' : "http://localhost:8000";

export const socket = io(URL, {
  autoConnect: false,
  path: '/node-api/socket.io/'
});
