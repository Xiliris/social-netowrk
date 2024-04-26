const router = require("express").Router();
const userSchema = require("../../schemas/postSchema");

router.get("/", async (req, res) => {
  try {
    const posts = await userSchema.find({}).sort({ date: -1 });

    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;
