const router = require("express").Router();
const profileSchema = require("../../schemas/profileSchema");

router.get("/:user", async (req, res) => {
  try {
    const user = await profileSchema.findOne({ username: req.params.user });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;
