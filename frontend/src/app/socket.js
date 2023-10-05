import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  // eslint-disable-next-line no-undef
  process.env.NODE_ENV === "production" ? ':8000' : "http://localhost:8000";

export const socket = io(URL, {
  autoConnect: false,
});
