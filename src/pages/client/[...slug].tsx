import ImageCustom from "@/components/img/ImageCustom";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import usePageBottom from "@/hooks/useReachPageBottom";

type awsFileType = {
  Key: string;
  LastModified: Date;
  ETag: string;
  Size: number;
  StorageClass: string;
};

const Client = () => {
  const router = useRouter();
  const { slug } = router.query;
  const reachedBottom = usePageBottom();

  const [title, setTitle] = useState("");
  const [files, setFiles] = useState<awsFileType[] | null>(null);
  const [filesToShow, setFilesToShow] = useState<awsFileType[] | null>(null);
  const [index, setIndex] = useState(20);
  const [columns, setColumns] = useState(3); // Pour gérer le nombre de colonnes du Masonry

  const getFiles = async (company: string, album: string) => {
    const res = await fetch(
      `/api/s3/getListBucket?company=${company}&album=${album}`
    );
    const result = await res.json();
    let tableau = [...result];
    tableau.sort(
      (a, b) =>
        new Date(a.LastModified).getTime() - new Date(b.LastModified).getTime()
    );

    if (tableau) {
      setFiles(tableau);
      getPhotoToShow(tableau);
    }
  };

  useEffect(() => {
    if (slug && slug?.length >= 2) {
      const [company, album] = slug as string[];
      setTitle(album);
      getFiles(company, album);
    }
  }, [slug]);

  const getPhotoToShow = (paths: awsFileType[]) => {
    let pathsToShow: awsFileType[] = [];
    for (let i = 0; i < index; i++) {
      if (paths[i] && !paths[i].Key.includes(".zip")) {
        pathsToShow.push(paths[i]);
      }
    }
    setFilesToShow(pathsToShow);
  };

  useEffect(() => {
    if (reachedBottom && files) {
      const totalLength = files.length;
      let actualIndex = index + 20;
      if (actualIndex > totalLength) {
        actualIndex = totalLength;
      }
      setIndex(actualIndex);
      getPhotoToShow(files);
    }
  }, [reachedBottom, files, index]);

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 1024) setColumns(4); // Large screens: 4 columns
      else if (window.innerWidth >= 768)
        setColumns(3); // Medium screens: 3 columns
      else setColumns(2); // Small screens: 2 columns
    };

    window.addEventListener("resize", updateColumns);
    updateColumns(); // Call it initially to set the column count

    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const downloadFile = async () => {
    const [company, album] = slug as string[];
    try {
      const response = await fetch(
        `/api/s3/generatePresignedUrl?company=${company}&album=${album}`
      );
      const data = await response.json();
      const a = document.createElement("a");
      a.href = data.url;
      a.download = "file.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("There was an error downloading the file:", error);
    }
  };

  // Créer les colonnes du Masonry
  const masonryColumns = () => {
    const columnsArray = Array.from({ length: columns }, () => []);
    filesToShow?.forEach((file, index) => {
      columnsArray[index % columns].push(file);
    });
    return columnsArray;
  };

  return (
    <div className="mt-20">
      <div>
        <h1 className="text-2xl font-bold">
          {title}
          <span className="ml-4 text-sm font-light">
            Photographe Matthieu Wandolski 06 24 53 45 96
          </span>
        </h1>
        <p>{(files?.length || 1) - 1} photos</p>
      </div>
      <div className="flex justify-center w-full">
        <button onClick={downloadFile} className="btn-link my-4">
          Tout télécharger
        </button>
      </div>

      <div className="masonry">
        {masonryColumns().map((column, colIndex) => (
          <div key={colIndex} className="masonry-column">
            {column.map(({ Key, Size }) => {
              if (Size === 0) return null;
              return (
                <div key={Key} className="relative">
                  <ImageCustom url={Key} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Client;
