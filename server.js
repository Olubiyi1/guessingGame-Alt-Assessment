import http from "http";
import express from "express";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv"
dotenv.config()

import socketHandler from "./game/game.socket.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(express.static("public"));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  socketHandler(io, socket);
});

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});