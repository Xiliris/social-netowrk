const router = require("express").Router();
const profileSchema = require("../../schemas/profileSchema");
const userSchema = require("../../schemas/userSchema");

router.post("/", async (req, res) => {
  try {
    const { type, value, user } = req.body;

    if (type === "username") {
      const userExists = await profileSchema.findOne({ username: value });

      if (userExists) {
        return res.status(500).json({ error: "Username already exists" });
      }

      await profileSchema.findOneAndUpdate(
        {
          username: user,
        },
        {
          username: value,
        }
      );

      await userSchema.findOneAndUpdate(
        {
          username: user,
        },
        {
          username: value,
        }
      );
    }

    res.status(200).json({ success: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;
