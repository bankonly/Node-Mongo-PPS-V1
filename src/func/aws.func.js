const AWS = require("aws-sdk");
const { v4 } = require("uuid");
const uuid = v4;
require("dotenv").config();

const key = process.env.AWS_ACCESS_KEY_ID;
const secret = process.env.AWS_SECRET_KEY;

const aws_config = new AWS.S3({
  accessKeyId: key,
  secretAccessKey: secret,
});

const uploadFile = async ({ file, bucket = process.env.AWS_S3_BUCKET_NAME, fileType = "jpg", path }) => {
  try {
    const fileName = path + uuid() + Date.now() + "." + fileType;

    // Setting up S3 upload parameters
    const option = {
      Bucket: bucket,
      Key: fileName,
      Body: file.data,
    };

    // Uploading files to the bucket
    aws_config.upload(option).promise();
    return fileName;
  } catch (error) {
    throw new Error(error.message);
  }
};

const get = async ({ file_name, bucket, fileName }) => {
  const option = {
    Key: fileName,
    Bucket: bucket,
  };
  const data = await aws_config.getObject(option).promise();
  let buf = Buffer.from(data.Body);
  let base64 = buf.toString("base64");
  let image = "<img src='data:image/jpeg;base64," + base64 + "'" + "/>";
  let startHTML = "<html><body></body>";
  let endHTML = "</body></html>";
  return startHTML + image + endHTML;
};

const AwsFunc = {
  uploadFile,
  get,
  aws_config,
};

module.exports = AwsFunc;
