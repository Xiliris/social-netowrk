const mongoose = require("mongoose");
const { mongoPath } = require("./config.json");

async function loadMongo() {
  await mongoose.connect(mongoPath, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return mongoose;
}

module.exports = async () => {
  await loadMongo()
    .then(() => {
      console.log("> Connected to Mongo database!");
    })
    .catch((err) => {
      console.log(err);
      mongoose.connection.close();
    });
};
