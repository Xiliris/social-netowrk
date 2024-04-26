const router = require("express").Router();
const multer = require("multer");
const postSchema = require("../../schemas/postSchema");

let fileName = "";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "storage");
  },
  filename: (req, file, callback) => {
    fileName = Date.now() + file.originalname;
    callback(null, fileName);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("uploadFile"), async (req, res) => {
  const contentTypeHeader = req.headers["content-type"];
  if (
    !contentTypeHeader ||
    !contentTypeHeader.includes("multipart/form-data")
  ) {
    return res.status(400).json({ error: "Invalid Content-Type header" });
  }

  const imageName = fileName;

  const dataPreset = {
    image: imageName,
    username: req.body.user,
    email: req.body.email,
    likes: 0,
    dislikes: 0,
    title: req.body.title,
    comment: req.body.comment,
    date: Date.now(),
    userInteractionLike: [],
    userInteractionDislike: [],
  };

  try {
    await new postSchema(dataPreset).save();

    res.status(200).json({ success: "Uploaded" });
  } catch (err) {
    res.status(500).json({ error: err });
    return;
  }
});

module.exports = router;
