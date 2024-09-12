import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const bucketName = process.env.BUCKET_NAME;

export const getFilesList = async (prefix) => {
  console.log("process.env.BUCKET_NAME", process.env.BUCKET_NAME);
  console.log("process.env.REGION", process.env.REGION);
  console.log("process.env.ACCESS_KEY_ID", process.env.ACCESS_KEY_ID);
  console.log("process.env.SECRET_ACCESS_KEY", process.env.SECRET_ACCESS_KEY);
  try {
    const s3Client = new S3Client({
      region: process.env.REGION,
      credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
      },
    });

    const params = {
      Bucket: bucketName,
      Prefix: `gallery/${prefix}`,
    };

    const command = new ListObjectsV2Command(params);
    const { Contents } = await s3Client.send(command);
    if (!Contents) return [];
    return Contents;
  } catch (err) {
    console.error("error:", err);
  }
};

export async function deleteFileFromS3(fileName) {
  const params = {
    Bucket: bucketName,
    Key: fileName,
  };
  await s3.deleteObject(params).promise();
}

export async function getArchiveFromS3(bucketName) {}
