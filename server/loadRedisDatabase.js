const { redisPath } = require("./config.json");
const redis = require("redis");

const redisClient = redis.createClient({
  url: redisPath,
});
redisClient.on("error", (err) => console.log(err));

module.exports.loadRedis = async () => {
  await redisClient
    .connect()
    .then(() => {
      console.log("> Connected to Redis database!");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.redisClient = redisClient;
