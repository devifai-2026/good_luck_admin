
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      try {
        const res = await fetch("https://api.cloudinary.com/v1_1/dd5tqor5g/image/upload", {
          method: "POST",
          body: JSON.stringify({
            file: reader.result,
            upload_preset: "goodluck_admin",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        if (data.secure_url) {
          resolve(data.secure_url);
        } else {
          reject(new Error("Image upload failed"));
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error("FileReader failed"));
  });
};
