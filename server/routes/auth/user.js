const router = require("express").Router();
const userSchema = require("../../schemas/userSchema");
const profileSchema = require("../../schemas/profileSchema");
const { redisClient } = require("../../loadRedisDatabase");

const errorMessages = {
  sessionExpired: "Login session expired.",
  missingToken: "Missing user token.",
  missingUser: "User account not found.",
  server:
    "Oops! We encountered a problem with our server. Please try again later or contact our support team for assistance.",
};

router.post("/", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    res.status(500).json({ error: errorMessages.missingToken });
    return;
  }

  const userToken = await redisClient.get(token);

  if (!userToken) {
    res.status(500).json({ error: errorMessages.sessionExpired });
    return;
  }

  try {
    const user = await userSchema.findOne({ email: userToken });

    if (!user) {
      res.status(404).json({ error: errorMessages.missingUser });
      return;
    }

    const userProfileData = await profileSchema.findOne({ email: user.email });

    if (!userProfileData) {
      res.status(404).json({ error: errorMessages.missingUser });
      return;
    }

    const userProfile = {
      username: userProfileData.username,
      email: userProfileData.email,
      avatar: userProfileData.avatar,
    };

    res.status(200).json(userProfile);
  } catch (err) {
    res.status(500).json({ error: errorMessages.server });
    return;
  }
});

module.exports = router;
