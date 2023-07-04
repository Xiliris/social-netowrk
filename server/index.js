const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const path = require("path");
const fs = require("fs");

const config = require("./config.json");
const loadMongo = require("./loadMongoDatabase");
const { loadRedis } = require("./loadRedisDatabase");
const app = express();

app.use(bodyParser.json());
app.use(cors());

loadMongo();
loadRedis();

const readRoutes = async (dir) => {
  const files = fs.readdirSync(path.join(__dirname, dir));
  for (const file of files) {
    const stat = fs.lstatSync(path.join(__dirname, dir, file));

    if (stat.isDirectory()) {
      readRoutes(path.join(dir, file));
    } else {
      const fileRoute = require(path.join(__dirname, dir, file));

      const routeDirectory = `${dir}/${file}`;
      const removeExtension = routeDirectory.replace(".js", "");
      const routeRemoveBackslashes = removeExtension.replace(/\\/g, "/");
      const routePath = `/${routeRemoveBackslashes.replace("routes/", "")}`;

      app.use(routePath, fileRoute);
    }
  }
};

readRoutes("routes");

app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.listen(config.PORT, () => {
  console.log(`> Server started on PORT: ${config.PORT}`);
});
