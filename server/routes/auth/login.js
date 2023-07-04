const router = require("express").Router();
const crypto = require("crypto");
const userSchema = require("../../schemas/userSchema");
const { redisClient } = require("../../loadRedisDatabase");
const createToken = require("../../modules/createToken");

const errorMessages = {
  missingDetails: "Please provide all the required information.",
  missingUser:
    "User not found. Please check your credentials or contact support.",
  wrongPassword: "Wrong password. Try again or contact support.",
  inactiveAccount:
    "Your account is not yet activated. Please check your email for further instructions",
  server:
    "Oops! We encountered a problem with our server. Please try again later or contact our support team for assistance.",
};

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  if ((!email, !password)) {
    return res.status(400).json({ error: errorMessages.missingDetails });
  }

  try {
    const user = await userSchema.findOne({ email: email });

    if (user) {
      const hashPassword = crypto
        .createHash("md5")
        .update(password)
        .digest("hex");

      if (user.active !== true) {
        return res.status(500).json({ error: errorMessages.inactiveAccount });
      }

      if (hashPassword !== user.password) {
        return res.status(500).json({ error: errorMessages.wrongPassword });
      }
      const userToken = createToken(128);

      res.status(200).json({
        token: userToken,
      });

      await redisClient.set(userToken, user.email);
      return;
    } else {
      return res.status(401).json({ error: errorMessages.missingUser });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: errorMessages.server });
  }
});

module.exports = router;
