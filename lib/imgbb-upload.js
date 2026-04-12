import axios from 'axios';

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || '320d584ff1e971e709c13e0d6f392157';

export const uploadToImgBB = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  
  try {
    const response = await axios({
      method: 'POST',
      url: `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data && response.data.data && response.data.data.url) {
      console.log('Upload success:', response.data.data.url);
      return response.data.data.url;
    } else {
      console.error('Unexpected response:', response.data);
      return null;
    }
  } catch (error) {
    console.error('ImgBB upload error:', error.response?.data || error.message);
    alert('Upload failed: ' + (error.response?.data?.error?.message || 'Please try again'));
    return null;
  }
};
