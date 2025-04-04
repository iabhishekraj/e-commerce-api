const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Upload multiple files to AWS S3
 * @param {Array} files - Array of file objects from Multer
 * @returns {Promise<Array>} - Array of uploaded file URLs
 */
const uploadFilesToS3 = async (files) => {
  try {
    const uploadPromises = files.map(async (file) => {
      console.log("process.env.S3_BUCKET_NAME", process.env.S3_BUCKET_NAME);
      const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `uploads/${Date.now()}_${file.originalname}`, // Unique filename
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      await s3.send(new PutObjectCommand(uploadParams));
      return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
    });

    return await Promise.all(uploadPromises); // Wait for all uploads to complete
  } catch (error) {
    console.error("Error uploading files to S3:", error);
    throw new Error("File upload failed");
  }
};

module.exports = { uploadFilesToS3 };
