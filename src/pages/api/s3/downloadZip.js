import AWS from "aws-sdk";

export default async function handler(req, res) {
  const { company, album } = req.query;

  const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION,
  });

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `gallery/${company}/ZIPS/${album}/${album}.zip`,
  };

  try {
    const data = await s3.getObject(params).promise();
    res.setHeader("Content-Type", data.ContentType);
    res.setHeader("Content-Disposition", `attachment; filename=${album}.zip`);
    res.send(data.Body);
  } catch (error) {
    console.error("Error downloading file from S3:", error);
    res.status(500).send("Error downloading file.");
  }
}
