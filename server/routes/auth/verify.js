const router = require("express").Router();
const userSchema = require("../../schemas/userSchema");
const profileSchema = require("../../schemas/profileSchema");

const errorMessages = {
  missingEmail: "Email with that code not found.",
  server:
    "Oops! We encountered a problem with our server. Please try again later or contact our support team for assistance.",
};

router.get("/:code", async (req, res) => {
  const { code } = req.params;

  const userData = await userSchema.findOne({ code });

  if (!userData) {
    return res.status(404).json({ error: errorMessages.missingEmail });
  }

  try {
    await userSchema.findOneAndUpdate(
      {
        code,
      },
      {
        code,
        active: true,
      }
    );

    await profileSchema.findOneAndUpdate(
      {
        email: userData.email,
      },
      {
        email: userData.email,
        username: userData.username,
        avatar: "https://www.w3schools.com/w3images/avatar2.png",
        friends: [],
      },
      {
        upsert: true,
      }
    );
    const { email, username } = userData;

    res.status(200).json({
      email,
      username,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: errorMessages.server });
  }
});

module.exports = router;
