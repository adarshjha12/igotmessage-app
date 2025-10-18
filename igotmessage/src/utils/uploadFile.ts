import axios from "axios";

async function uploadMultiple(files: File[]) {
    const backendUrl =
  process.env.NODE_ENV === "production"
    ? "https://igotmessage-app-backend.onrender.com"
    : "http://localhost:5000";

  const { data: auth } = await axios.get(`${backendUrl}/api/upload/upload-auth`);

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