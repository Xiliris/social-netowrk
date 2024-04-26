const router = require("express").Router();
const adminList = require("../../adminConfig.json");

router.get("/:user", async (req, res) => {
  try {
    for (let admin of adminList.admins) {
      console.log(admin);

      if (admin === req.params.user) {
        res.status(200).json({ admin: true });
        return;
      } else {
        res.status(200).json({ admin: false });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;
