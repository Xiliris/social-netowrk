const crypto = require("crypto");
const router = require("express").Router();

const userSchema = require("../../schemas/userSchema");
const sendMail = require("../../modules/sendVerifyMail");
const createCode = require("../../modules/createCode");

const successMessage =
  "Your registration has been successfully completed. Welcome aboard!";

const errorMessages = {
  foundUser:
    "Sorry, but the email or username you entered is already taken. Please try logging in with your existing credentials or contact our support team for assistance.",
  missingDetails: "Please provide all the required information.",
  invalidEmail: "Invalid email. Try again or contact support",
  userExists: "User with that email or username already exists.",
  server:
    "Oops! We encountered a problem with our server. Please try again later or contact our support team for assistance.",
};

router.post("/", async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ error: errorMessages.missingDetails });
  }

  const hashPassword = crypto.createHash("md5").update(password).digest("hex");
  const token = createCode(5);

  const user = {
    email,
    username,
    password: hashPassword,
    active: false,
    code: token,
  };

  try {
    const userDB = await userSchema.findOne({ $or: [{ email }, { username }] });
    if (userDB) {
      return res.status(500).json({ error: errorMessages.foundUser });
    }

    sendMail(email, token).catch((err) => console.log(err));
    await new userSchema(user).save();
    return res.status(200).json(successMessage);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: errorMessages.server });
  }
});

module.exports = router;
