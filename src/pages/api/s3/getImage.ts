import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});

const s3 = new AWS.S3();

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { path } = req.query;
    const bucketName = process.env.BUCKET_NAME;
    try {
      const params = {
        Bucket: bucketName,
        Key: path,
      };

      const fileStream = s3.getObject(params).createReadStream();
      fileStream.pipe(res);

      res.setHeader("Content-Disposition", `attachment; filename="${path}"`);
    } catch (error) {
      throw `Erreur lors de la récupération du fichier depuis S3 :${error}`;
    }
  } else {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }
}
