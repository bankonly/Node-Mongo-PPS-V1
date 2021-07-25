const res = require("ssv-response-no-res");
const Mail = require("nodemailer");

const MailFunc = {
  send: async ({ to, text = "Greeting!!", subject = "from Codian-Cademy", from = null, otp_code, link }) => {
    const transporter = Mail.createTransport({
      service: process.env.MAIL_SERVICE,
      auth: {
        user: process.env.MAIL_ID,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mailSendOption = {
      from: from == null ? process.env.MAIL_ID : from,
      to: to,
      subject: subject,
      text: text,
      html: `
      <h3>Codian Academy</h3>
      <p>Your verify code</p>
      <h1>${otp_code}</h1>
      `,
    };

    console.log(mailSendOption);

    const sendMail = await transporter.sendMail(mailSendOption);
    if (sendMail.error) throw new Error("  Mail failed");
  },
  generateLink: ({ host, otp_code }) => host + otp_code,
};

module.exports = MailFunc;
