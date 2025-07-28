import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

export const getRecommendations = async (title) => {
  try {
    const response = await axios.post(`${API_URL}/recommend`, { title });
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};

export const getUserRecommendations = async (titles) => {
  try {
    const response = await axios.post(`${API_URL}/user_recommendations`, { titles });
    return response.data;
  } catch (error) {
    console.error('Error fetching user recommendations:', error);
    throw error;
  }
};
