const redis = require('redis');
const redis_conf = require('./redisConf.js');

const rClient = redis.createClient(redis_conf);

rClient.on('connect', () => {
    console.log('Client connected to redis...')
})

rClient.on('ready', () => {
    console.log('Client connected to redis and ready to use...')
})

rClient.on('error', (err) => {
    console.log(err.message)
})

rClient.on('end', () => {
    console.log('Client disconnected from redis')
})

process.on('SIGINT', () => {
    rClient.quit()
})

module.exports = rClient;