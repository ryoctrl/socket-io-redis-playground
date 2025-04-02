const http = require('http');
const { createClient } = require('redis');
const { createAdapter } = require('@socket.io/redis-adapter');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 4000;
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const server = http.createServer();
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Redis クライアント作成
const pubClient = createClient({ url: `redis://${REDIS_HOST}:${REDIS_PORT}` });
const subClient = pubClient.duplicate();

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
    io.adapter(createAdapter(pubClient, subClient));

    io.on('connection', (socket) => {
        console.log(`[${PORT}] Connected: ${socket.id}`);

        socket.on('message', (msg) => {
            console.log(`[${PORT}] Message from ${socket.id}: ${msg}`);
            io.emit('message', `[${PORT}] ${msg}`);
        });

        socket.on('disconnect', () => {
            console.log(`[${PORT}] Disconnected: ${socket.id}`);
        });
    });

    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

