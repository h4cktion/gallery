import { getFilesList } from "@/server/utils/aws/awsUtils";
import { GetObjectCommand, S3 } from "@aws-sdk/client-s3";
import archiver from "archiver";
import AWS from "aws-sdk";
import { NextApiRequest, NextApiResponse } from "next";
import { PassThrough } from "stream";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

// AWS.config.update({
//   accessKeyId: process.env.ACCESS_KEY_ID,
//   secretAccessKey: process.env.SECRET_ACCESS_KEY,
//   region: process.env.REGION,
// });

const AWS_CONFIG = {
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
  region: process.env.REGION,
};

const s3 = new S3Client(AWS_CONFIG);
const AWS_S3_BUCKET = process.env.BUCKET_NAME;

async function getReadableStreamFromS3(s3Key) {
  console.log("getReadableStreamFromS3 s3Key : ", s3Key);
  const command = new GetObjectCommand({
    Bucket: AWS_S3_BUCKET,
    Key: s3Key,
  });
  const response = await s3.send(command);
  return response.Body;
}

function getWritableStreamFromS3(zipFileS3Key) {
  let _passthrough = new PassThrough();
  const s3 = new S3(AWS_CONFIG);
  new Upload({
    client: s3,
    params: {
      Bucket: AWS_S3_BUCKET,
      Key: zipFileS3Key,
      Body: _passthrough,
    },
  }).done();
  return _passthrough;
}

async function generateAndStreamZipfileToS3(s3KeyList, zipFileS3Key) {
  try {
    let zip = archiver("zip");
    for (const s3Key of s3KeyList) {
      if (s3Key.Size === 0) continue;
      const s3ReadableStream = await getReadableStreamFromS3(s3Key.Key);
      zip.append(s3ReadableStream, { name: s3Key.Key.split("/").pop() });
    }
    const s3WritableStream = getWritableStreamFromS3(zipFileS3Key);
    zip.pipe(s3WritableStream);
    zip.finalize();
    console.log("Zip file created and streamed to S3.");
  } catch (error) {
    console.error(`Error in generateAndStreamZipfileToS3 ::: ${error.message}`);
  }
}

export async function generatePresignedURLforZip(zipFileS3Key) {
  console.info("Generating Presigned URL for the zip file.");
  const client = new S3Client(AWS_CONFIG);
  const command = new GetObjectCommand({
    Bucket: AWS_S3_BUCKET,
    Key: zipFileS3Key,
  });
  const signedUrl = await getSignedUrl(client, command, {
    expiresIn: 24 * 3600,
  });
  return signedUrl;
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { company, album } = req.query;

    try {
      // const albumPath = `${company}/${album}`;
      const albumPath = `${company}/user2`;
      const filesList = await getFilesList(albumPath);

      console.log("filesList : ", filesList);
      generateAndStreamZipfileToS3(filesList, "test.zip");
    } catch (error) {
      throw `Erreur lors de la création de l'archive :${error}`;
    }
  } else {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }
}
