import axios from 'axios';

const BASE_URL = 'http://localhost:5000'; // Adjust if your server runs on a different URL or port

export const getColors = async (mode) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/colors?mode=${mode}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching colors:', error);
    throw error;
  }
};