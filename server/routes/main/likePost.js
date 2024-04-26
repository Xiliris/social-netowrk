const router = require("express").Router();
const postSchema = require("../../schemas/postSchema");

router.post("/", async (req, res) => {
  const { postId, email } = req.body;

  try {
    const post = await postSchema.findOne({ _id: postId });

    if (post.userInteractionLike.includes(email)) {
      await postSchema.findOneAndUpdate(
        {
          _id: postId,
        },
        {
          _id: postId,
          $inc: { likes: -1 },
          $pull: { userInteractionLike: email },
        },
        {
          upsert: true,
        }
      );

      res.status(200).json({ like: false });
      return;
    }

    await postSchema.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        _id: postId,
        $inc: { likes: 1 },
        $push: { userInteractionLike: email },
      },
      {
        upsert: true,
      }
    );

    res.status(200).json({ like: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;
