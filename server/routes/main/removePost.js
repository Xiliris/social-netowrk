const router = require("express").Router();
const postSchema = require("../../schemas/postSchema");
const fs = require("fs");
const path = require("path");
const adminList = require("../../adminConfig.json");

router.post("/", async (req, res) => {
  try {
    const { postId, username } = req.body;

    const post = await postSchema.findById(postId);

    if (!post) return res.status(404).json({ error: "Post not found" });
    if (!adminList.admins.includes(username)) {
      if (post.username !== username)
        return res.status(401).json({ error: "Unauthorized" });
    }

    await fs.unlink(
      path.join(__dirname, "../../storage", post.image),
      async (err) => {
        if (err) {
          console.log(err);
        } else {
          await postSchema.findByIdAndDelete(postId);
          res.status(200).json({ message: "Post deleted" });
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;
