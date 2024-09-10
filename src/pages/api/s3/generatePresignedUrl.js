// pages/api/generatePresignedUrl.js
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
    Key: `gallery/${company}/ZIPS/${album}/${album}.zip`, // Le nom du fichier à télécharger
    Expires: 60, // Durée de validité de l'URL en secondes
  };

  try {
    const url = s3.getSignedUrl("getObject", params);
    res.status(200).json({ url });
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    res.status(500).send("Error generating pre-signed URL.");
  }
}
