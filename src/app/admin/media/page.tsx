"use client";

import {
  useEffect,
  useState,
} from "react";

import mediaService from "@/services/mediaService";

import UploadMedia from "@/components/media/MediaUploader";
import MediaGrid from "@/components/media/MediaGrid";

export default function MediaPage() {
  const [images, setImages] =
    useState<any[]>([]);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages =
    async () => {
      const data =
        await mediaService.getAllImages();

      setImages(data);
    };

  const handleUpload =
    async (
      file: File
    ) => {
      await mediaService.uploadImage(
        file
      );

      alert(
        "Image uploaded successfully"
      );

      loadImages();
    };

  const handleDelete =
    async (
      path: string
    ) => {
      const confirmed =
        confirm(
          "Delete image?"
        );

      if (!confirmed)
        return;

      await mediaService.deleteImage(
        path
      );

      loadImages();
    };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Media Manager
      </h1>

      <UploadMedia
        onUpload={
          handleUpload
        }
      />

      <MediaGrid
        images={images}
        onDelete={
          handleDelete
        }
      />
    </div>
  );
}