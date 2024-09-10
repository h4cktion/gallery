/* eslint-disable react-hooks/exhaustive-deps */
import Image from "next/image";
import React, { useEffect, useState } from "react";

function ImageCustom({ url }: { url: string }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  async function getImagePreview() {
    const response = await fetch(`/api/s3/getImage?path=${url}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Erreur lors du téléchargement du fichier.");
    }
    const blob = await response.blob();
    // const img = URL.createObjectURL(blob);
    // console.log("img", img);
    // setImageUrl(img);
    const imgURL = URL.createObjectURL(blob);
    const img = new window.Image();
    img.src = imgURL;

    img.onload = function () {
      console.log("----------------");
      console.log("img.width", img.width);
      console.log("img.height", img.height);

      const width = img.width / 4;
      const height = img.height / 4;
      console.log("width", width);
      console.log("height", height);
      console.log("----------------");
      setImageSize({ width, height });
      setImageUrl(imgURL);
    };

    img.onerror = function () {
      console.error("Erreur lors du chargement de l'image.");
    };
  }

  useEffect(() => {
    if (url) {
      getImagePreview();
    }
  }, [url]);

  return (
    <div className="my-3 mx-auto ">
      {imageUrl && imageSize && (
        <Image
          src={imageUrl}
          // height="150"
          // width="400"
          width={imageSize.width}
          height={imageSize.height}
          alt={url}
        />
      )}
    </div>
  );
}

export default ImageCustom;
