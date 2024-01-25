/* eslint-disable react-hooks/exhaustive-deps */
import ImageCustom from "@/components/img/ImageCustom";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
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

  const getFiles = async (company: string, album: string) => {
    const res = await fetch(
      `/api/s3/getListBucket?company=${company}&album=${album}`
    );
    const result = await res.json();
    if (result) {
      setFiles(result);
      getPhotoToShow(result);
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
      pathsToShow.push(paths[i]);
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

  return (
    <div className="mt-20">
      <div className="my-20">
        <h1 className="text-2xl font-bold">
          {title}
          <span className="ml-4 text-sm font-light">
            Photographe Matthieu Wandolski 06 24 53 45 96
          </span>
        </h1>
        <p>{(files?.length || 1) - 1} photos</p>
      </div>
      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 4 }}>
        <Masonry columnsCount={4}>
          {filesToShow &&
            filesToShow.map(({ Key, Size }) => {
              if (Size === 0) return;
              return <ImageCustom key={Key} url={Key} />;
            })}
          {(!files || files.length <= 0) && <span>Album vide.</span>}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
};

export default Client;
