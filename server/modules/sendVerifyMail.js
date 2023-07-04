const { frontendURL } = require("../config.json");
const nodeMailer = require("nodemailer");

const {
  serviceEmail,
  servicePassword,
  websiteLink,
} = require("../config.json");

module.exports = async (userEmail, token) => {
  const htmlTemplate = require("../email/confirm");

  const html = htmlTemplate(`${frontendURL}/auth/verify/${token}`, websiteLink);

  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: serviceEmail,
      pass: servicePassword,
    },
  });

  const info = await transporter.sendMail({
    from: serviceEmail,
    to: userEmail,
    subject: "Verify your account.",
    html,
  });
};
