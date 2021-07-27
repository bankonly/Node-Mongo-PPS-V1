const AWS = require("aws-sdk");
const { v4 } = require("uuid");
const uuid = v4;
require("dotenv").config();
const sharp = require('sharp');

const key = process.env.AWS_ACCESS_KEY_ID;
const secret = process.env.AWS_SECRET_KEY;

const aws_config = new AWS.S3({
  accessKeyId: key,
  secretAccessKey: secret,
});

const uploadFile = async ({ file, bucket = process.env.AWS_S3_BUCKET_NAME, fileType = "jpg", path, complete = false }) => {
  try {
    const only_file_name = uuid() + Date.now() + "." + fileType;
    const fileName = path + only_file_name

    // Setting up S3 upload parameters
    const option = {
      Bucket: bucket,
      Key: fileName,
      Body: file.data,
    };

    // Uploading files to the bucket
    if (complete) {
      await aws_config.upload(option).promise();
    } else {
      aws_config.upload(option).promise();

    }
    return fileName;
  } catch (error) {
    throw new Error(error.message);
  }
};

const upload_img = async ({ file, bucket = process.env.AWS_S3_BUCKET_NAME, fileType = "jpg", path, resize, complete = false }) => {
  try {
    const only_file_name = uuid() + Date.now() + "." + fileType;
    const fileName = path + only_file_name

    // Setting up S3 upload parameters
    const option = {
      Bucket: bucket,
      Key: fileName,
      Body: file.data,
    };
    if (complete) {
      await aws_config.upload(option).promise();
    } else {
      aws_config.upload(option).promise();

    }

    if (Array.isArray(resize)) {
      for (let i = 0; i < resize.length; i++) {
        const element = resize[i];
        const image_resized = await sharp(file.data)
          .resize(element, element, {
            fit: sharp.fit.inside,
            withoutEnlargement: true,
          })
          .toBuffer()

        const resize_path = path + element + "x" + element + "/" + only_file_name
        const resize_option = {
          Bucket: bucket,
          Key: resize_path,
          Body: image_resized,
        };
        if (complete) {
          await aws_config.upload(resize_option).promise();
        } else {
          aws_config.upload(resize_option).promise();
        }
      }
    }

    return only_file_name;
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
  upload_img
};

module.exports = AwsFunc;
