const keys = require('./keys');
const redis = require('redis');

// Connect to a redis and retry every 1s if the connection is fail
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

const sub = redisClient.duplicate();

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

// Everytime that we see a new value (message)
// that show up on redis then we run the fib function
// insert it into hashof values with key is message and value calculated
sub.on('message', (channel, message) => {
  redisClient.hset('values', message, fib(parseInt(message)));
});
sub.subscribe('insert');
