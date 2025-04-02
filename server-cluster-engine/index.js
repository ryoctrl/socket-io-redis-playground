const { RedisEngine } = require("@socket.io/cluster-engine");
const { createServer } = require("node:http");
const { createClient } = require("redis");
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");

// const { createProxyServer } = proxyModule;

const PORT = process.env.PORT || 3000;
const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = process.env.REDIS_PORT || 6379;

async function initServer() {
  const httpServer = createServer((req, res) => {
    res.writeHead(404).end();
  });

  const pubClient = createClient({
    url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
  });
  const subClient = pubClient.duplicate();

  await Promise.all([pubClient.connect(), subClient.connect()]);

  const engine = new RedisEngine(pubClient, subClient);

  engine.attach(httpServer, {
    path: "/socket.io/",
  });

  const io = new Server({
    adapter: createAdapter(pubClient, subClient),
  });

  io.bind(engine);

  io.on("connection", (socket) => {
    socket.on("hello", () => {
      socket.broadcast.emit("hello", socket.id, port);
    });
  });

  httpServer.listen(PORT);
}

initServer();

// function initProxy() {
//   const proxy = createProxyServer();

//   function randomTarget() {
//     return [
//       "http://localhost:3001",
//       "http://localhost:3002",
//       "http://localhost:3003",
//     ][Math.floor(Math.random() * 3)];
//   }

//   const httpServer = createServer((req, res) => {
//     proxy.web(req, res, { target: randomTarget() });
//   });

//   httpServer.on("upgrade", function (req, socket, head) {
//     proxy.ws(req, socket, head, { target: randomTarget() });
//   });

//   httpServer.listen(3000);
// }

// await Promise.all([initServer(3001), initServer(3002), initServer(3003)]);

// initProxy();
