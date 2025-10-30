import axios from "axios";

async function uploadMultiple(files: File[]) {
  const url =
    process.env.NODE_ENV === "production"
      ? `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}`
      : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}`;

  const { data: auth } = await axios.get(`${url}/api/upload/upload-auth`);

  const uploadPromises = files.map(async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);
    formData.append("publicKey", process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!);
    formData.append("signature", auth.signature);
    formData.append("expire", auth.expire);
    formData.append("token", auth.token);

    const res = await axios.post(
      "https://upload.imagekit.io/api/v1/files/upload",
      formData
    );

    return res.data;
  });

  const uploadedFiles = await Promise.all(uploadPromises);

  console.log("All uploads done:", uploadedFiles);
  return uploadedFiles;
}

export default uploadMultiple;
