import {
  upload,
  ImageKitInvalidRequestError,
  ImageKitAbortError,
  ImageKitUploadNetworkError,
  ImageKitServerError,
} from "@imagekit/javascript";
import axios from "axios";

const url =
  process.env.NODE_ENV === "production"
    ? `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}/api/upload/upload-auth`
    : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/api/upload/upload-auth`;

const uploadFiles = async (files: File[]) => {
  const res = await axios.get(url);

  if (!res.data) throw new Error("Failed to get upload auth");

  const { token, signature, expire } = res.data;

  try {
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const uploadOptions = {
          file,
          fileName: file.name,
          token,
          signature,
          expire,
          publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
          urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
        };

        const response = await upload(uploadOptions);
        console.log("✅ Upload successful:", response);
        return response;
      })
    );

    return uploadedFiles;
  } catch (error) {
    if (error instanceof ImageKitAbortError)
      console.error("Upload aborted:", error.reason);
    else if (error instanceof ImageKitInvalidRequestError)
      console.error("Invalid request:", error.message);
    else if (error instanceof ImageKitUploadNetworkError)
      console.error("Network error:", error.message);
    else if (error instanceof ImageKitServerError)
      console.error("Server error:", error.message);
    else console.error("Upload error:", error);

    throw error;
  }
};

export default uploadFiles;
