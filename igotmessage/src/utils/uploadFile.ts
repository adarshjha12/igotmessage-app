import ImageKit from "imagekit-javascript";

async function uploadMultiple(files: File[]) {
  // Choose backend URL dynamically (local or production)
  const backendUrl =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL
      : process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL;

  // Initialize ImageKit client (frontend SDK)
  const imagekit = new (ImageKit as any)({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!, // safe for frontend
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
    authenticationEndpoint: `${backendUrl}/api/upload/upload-auth`, // backend endpoint that returns signature
  });

  // Upload all files concurrently
  const uploadPromises = files.map((file) =>
    imagekit.upload({
      file,               // actual File object
      fileName: file.name, // name to be stored in ImageKit
      folder: "/uploads",  // optional - set folder path in ImageKit
    })
  );

  const uploadedFiles = await Promise.all(uploadPromises);

  console.log("✅ All uploads done:", uploadedFiles);
  return uploadedFiles;
}

export default uploadMultiple;
