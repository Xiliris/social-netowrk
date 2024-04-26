const router = require("express").Router();
const postSchema = require("../../schemas/postSchema");

router.post("/", async (req, res) => {
  const { postId, email } = req.body;

  try {
    const post = await postSchema.findOne({ _id: postId });

    if (post.userInteractionDislike.includes(email)) {
      await postSchema.findOneAndUpdate(
        {
          _id: postId,
        },
        {
          _id: postId,
          $inc: { dislikes: -1 },
          $pull: { userInteractionDislike: email },
        },
        {
          upsert: true,
        }
      );

      res.status(200).json({ dislike: false });
      return;
    }

    await postSchema.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        _id: postId,
        $inc: { dislikes: 1 },
        $push: { userInteractionDislike: email },
      },
      {
        upsert: true,
      }
    );

    res.status(200).json({ dislike: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;
