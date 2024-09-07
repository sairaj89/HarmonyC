import axios from 'axios';

// Conditionally set the BASE_URL based on environment
const BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000'  // Development URL
  : 'https://server-harmony.vercel.app';  // Production URL

export const getColors = async (mode) => {
  if (!mode) {
    throw new Error('Mode is required to fetch colors');
  }
  
  try {
    const response = await axios.get(`${BASE_URL}/api/colors?mode=${mode}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching colors:', error);
    throw error;
  }
};
