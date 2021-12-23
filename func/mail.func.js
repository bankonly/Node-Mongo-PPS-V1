const Mail = require("nodemailer");
const { JwtGeneratorResetToken, JwtGenerator } = require("./common-func");
const OtpModel = require("starter-model-mongo/models/opt.model");
const _ = require("ssv-utils");
const twilio_sms = require("twilio-sms");

const OTP_ALLOW_SEND_TIME = 3;
const OPT_ALLOW_RESENT_SECOND = 60;
const OTP_EXPIRED_TIME = 60;

const MailFunc = {
  send: async ({ to, text = "Greeting!!", subject = "SUBJECT", from = null, otp_code, link }) => {
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
      <h3>TipTric</h3>
      <p>Your verify code</p>
      <h1>${otp_code}</h1>
      `,
    };

    const sendMail = await transporter.sendMail(mailSendOption);
    if (sendMail.error) throw new Error("  Mail failed");
  },
  generateLink: ({ host, otp_code }) => host + otp_code,
};

const OtpFunc = {
  send_otp: async ({ model, req, opts, conf, to, type = "phone" }) => {
    const body = req.body;

    const user = await model.findOne(conf);
    if (!user) throw new Error("400-ERR4002");

    const user_id = user._id.toString();

    const opt_new_code = _.generateOtp({});
    let otp_code = {
      otp_code: opt_new_code,
    };

    let save_data = {};
    save_data.code = opt_new_code;
    save_data.expire_time = _.date.addTime(OTP_EXPIRED_TIME);
    save_data.resend_after = _.date.addTime(OPT_ALLOW_RESENT_SECOND);
    save_data.author = user._id;

    let new_otp = null;

    const otp_data = await OtpModel.findOne({ author: user_id });
    if (!otp_data) {
      new_otp = await new OtpModel(save_data).save(opts);
    } else {
      const resend_time_sec = _.date.dateToSec(otp_data.resend_after);
      const now_sec = _.date.nowSec();
      const minus_in_sec = resend_time_sec - now_sec;

      if (now_sec < resend_time_sec) throw new Error(`400-ERR4003::${minus_in_sec}`);

      otp_data.resend_count = 0;
      otp_data.expire_time = save_data.expire_time;
      otp_data.resend_after = save_data.resend_after;
      otp_data.code = save_data.code;
      new_otp = await otp_data.save(opts);
    }

    if (!new_otp) throw new Error("otp save failed");

    if (type === "phone") {
      await twilio_sms.send_sms({ to: to, message: "This is your verify code: " + opt_new_code });
    } else {
      await MailFunc.send({
        to: user.email,
        otp_code: otp_code.otp_code,
        link: MailFunc.generateLink({
          host: process.env.APP_HOST,
          otp_code: otp_code.otp_code,
        }),
      });
    }

    const payload = { _id: user._id };
    const token = JwtGeneratorResetToken(payload);

    return token;
  },
  verify_otp: async ({ req, auth }) => {
    const body = req.body;
    if (_.isEmpty(body.otp_code)) throw new Error("400-ERR4001");

    const otp_data = await OtpModel.findOne({ author: auth._id });
    if (!otp_data) throw new Error(`400-ERR4002`);

    const expire_time_sec = _.date.dateToSec(otp_data.expire_time);
    const now_sec = _.date.nowSec();

    // check otp_code is expired or not
    if (expire_time_sec < now_sec) {
      otp_data.resend_count = 0;
      otp_data.allow_to_reset = false;
      await otp_data.save();
      throw new Error("400-ERR4003");
    }

    if (otp_data.resend_count > OTP_ALLOW_SEND_TIME) throw new Error("400-ERR4004");

    if (otp_data.code !== body.otp_code) {
      otp_data.resend_count += 1;
      throw new Error("400-ERR4005");
    }

    otp_data.allow_to_reset = true;
    await otp_data.save();

    const payload = { _id: auth._id };
    const access_credential = JwtGenerator(payload);

    return access_credential;
  },
  reset_password: async (model, { req }) => {
    const body = req.body;
    const auth = req.user;

    const otp_data = await OtpModel.findOne({
      author: auth._id,
      allow_to_reset: true,
    });
    if (!otp_data) throw new Error("400-ERR4001");

    const user = await model.findById(auth._id);
    if (!user) throw new Error("400-ERR4002");

    user.password = await _.bcryptFn.hashPassword(body.password);
    if (!(await user.save())) throw new Error("failed to save new password");

    otp_data.allow_to_reset = false;
    await otp_data.save();
  },
};

module.exports = OtpFunc;
