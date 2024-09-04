import axios from 'axios';

const BASE_URL = 'https://server-harmony.vercel.app'; // URL where your backend is hosted

export const getColors = async (mode) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/colors?mode=${mode}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching colors:', error);
    throw error;
  }
};
