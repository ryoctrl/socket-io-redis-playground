const http = require('http');
const socketIo = require('socket.io');
const redisAdapter = require('socket.io-redis');

const PORT = process.env.PORT || 3000;
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const server = http.createServer();
const io = socketIo(server);

// Redis アダプター設定
io.adapter(redisAdapter({ host: REDIS_HOST, port: REDIS_PORT }));

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

