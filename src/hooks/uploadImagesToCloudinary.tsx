export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'goodluck_admin');
    
    const response = await fetch(
      'https://api.cloudinary.com/v1_1/dd5tqor5g/image/upload',
      {
        method: 'POST',
        body: formData,
        // Do NOT set Content-Type header for FormData
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
    
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};