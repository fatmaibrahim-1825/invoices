const AWS = require("aws-sdk");
const {
  ACCESS_KEY_ID,
  SECRET_ACCESS_KEY,
  S3_BUCKET_NAME,
  REGION,
  EMAIL_ADDRESS,
  EMAIL_PASSWORD,
} = require("../config/index");
const mime = require("mime");
const nodemailer = require("nodemailer");
const randombytes = require("randombytes");
const { Store } = require("../stores/Store");

AWS.config = new AWS.Config({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  region: REGION,
  signatureVersion: "v4",
});

const s3 = new AWS.S3();

exports.getSignedUrl = (filename) => {
  const preSignedUrl = s3.getSignedUrl("putObject", {
    Key: filename,
    Bucket: S3_BUCKET_NAME,
    Expires: 900,
    ContentType: mime.getType(filename),
  });

  return preSignedUrl;
};

exports.putFileInBucket = async (file, urlKey) => {
  const params = {
    Body: file.buffer,
    Bucket: S3_BUCKET_NAME,
    Key: urlKey,
    ContentType: file.mimetype,
  };
  let d;
  await s3
    .putObject(params)
    .promise()
    .then((data) => {
      d = data.ETag;
    })
    .catch((e) => {
      throw new Error("something wrong happened, please try again./n" + e);
    });
  return d;
};
exports.putPDFFileInBucket = async (file, urlKey) => {
  const params = {
    Body: file,
    Bucket: S3_BUCKET_NAME,
    Key: urlKey,
    ContentType: "application/pdf",
  };
  let d;
  await s3
    .putObject(params)
    .promise()
    .then((data) => {
      d = data.ETag;
    })
    .catch((e) => {
      throw new Error("something wrong happened, please try again. " + e);
    });
  return d;
};

exports.getFileFromBucket = async (fileName) => {
  const params = {
    Bucket: S3_BUCKET_NAME,
    Key: fileName,
  };
  let d;
  await this.s3
    .getObject(params)
    .promise()
    .then((data) => {
      d = data.Body.toString();
    })
    .catch((e) => {
      throw new NotFoundException("The specified file does not exist./n" + e);
    });
  return d;
};

exports.sendEmailToResetPassword = async (obj) => {
  const generatedToken = randombytes(16);
  const convertTokenToHexString = generatedToken.toString("hex");

  const resetToken = convertTokenToHexString;
  const now = new Date();
  const expireToken = AddMinutesToDate(now, 10);
  if (obj.getClassName() === "Store") {
    await Store.findByIdAndUpdate(
      obj._id,
      { resetToken, expireToken },
      { new: true }
    );
  } else {
    return {
      statusCode: 500,
      message: "Sorry!! something went wrong. Please try again later.",
    };
  }
  const email_subject = "Reset Password";

  const email_message = `<html>
        <body>
          Dear User, <br><br>
          Please follow the link to reset your password:<br><br>
          <a href="https://invoices.itstcc.com/reset-password?token=${convertTokenToHexString}">Click here to reset your password</a>
          <br><br>
          This is an auto-generated email. Please do not reply to this email.
        </body>
      </html>`;
  const auth = { user: EMAIL_ADDRESS, pass: EMAIL_PASSWORD };
  const info = await sendEMail(
    email_subject,
    email_message,
    auth,
    EMAIL_ADDRESS,
    obj.email
  );
  if (info) {
    return {
      statusCode: 200,
      message: "Email is sent to the user",
    };
  } else {
    return {
      statusCode: 500,
      message: "Sorry!! something went wrong. Please try again later.",
    };
  }
};

const sendEMail = async (email_subject, email_message, auth, from, to) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: auth,
  });

  const mailOptions = {
    from: from,
    to: to,
    subject: email_subject,
    html: email_message,
  };

  const verified = await transporter.verify();
  if (!verified) {
    return {
      statusCode: 400,
      message: "Your email is not verified",
    };
  }

  const info = await transporter.sendMail(mailOptions);
  return info;
};

function AddMinutesToDate(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}
