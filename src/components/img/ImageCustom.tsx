import Image from "next/image";
import React, { useEffect, useState } from "react";

function ImageCustom({ url }: { url: string }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  async function getImagePreview() {
    const response = await fetch(`/api/s3/getImage?path=${url}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Erreur lors du téléchargement du fichier.");
    }
    const blob = await response.blob();
    const img = URL.createObjectURL(blob);
    setImageUrl(img);
  }

  useEffect(() => {
    if (url) {
      getImagePreview(url);
    }
  }, [url]);

  return (
    <div className="my-3 mx-auto ">
      {imageUrl && <Image src={imageUrl} height="150" width="200" alt={url} />}
    </div>
  );
}

export default ImageCustom;
