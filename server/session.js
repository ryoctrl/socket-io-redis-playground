const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
});

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const expireAsync = promisify(client.expire).bind(client);

async function saveSession(sessionId, data) {
    await setAsync(sessionId, JSON.stringify(data));
    await expireAsync(sessionId, 60 * 60); // 1時間有効
}

async function getSession(sessionId) {
    const data = await getAsync(sessionId);
    return data ? JSON.parse(data) : null;
}

module.exports = { saveSession, getSession };

