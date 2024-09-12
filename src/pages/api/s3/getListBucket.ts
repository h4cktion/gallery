import { getFilesList } from "@/server/utils/aws/awsUtils";
import { NextApiRequest, NextApiResponse } from "next";

// import { getFilesList } from "@/server/AWS/s3Helpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { company, album } = req.query;
console.log('ici')
    try {
      const albumPath = `${company}/${album}`;
      const filesList = await getFilesList(albumPath);
      res.status(200).json(filesList);
    } catch (error) {
      res.status(500).json({
        error:
          "Une erreur est survenue lors de la récupération de la liste des fichiers.",
      });
    }
  } else {
    res.status(405).json({ error: "Méthode non autorisée." });
  }
}
