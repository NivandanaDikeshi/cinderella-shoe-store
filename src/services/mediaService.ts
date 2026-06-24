import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";

import { storage } from "@/lib/firebase/config";

const uploadImage = async (
  file: File
) => {
  const fileName =
    `${Date.now()}-${file.name}`;

  const storageRef = ref(
    storage,
    `media/${fileName}`
  );

  await uploadBytes(
    storageRef,
    file
  );

  return await getDownloadURL(
    storageRef
  );
};

const getAllImages =
  async () => {
    const folderRef = ref(
      storage,
      "media"
    );

    const result =
      await listAll(folderRef);

    const files =
      await Promise.all(
        result.items.map(
          async (item) => ({
            name: item.name,
            url:
              await getDownloadURL(
                item
              ),
            path: item.fullPath,
          })
        )
      );

    return files;
  };

const deleteImage =
  async (
    path: string
  ) => {
    const fileRef = ref(
      storage,
      path
    );

    await deleteObject(
      fileRef
    );
  };

export default {
  uploadImage,
  getAllImages,
  deleteImage,
};