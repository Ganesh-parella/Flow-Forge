import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

// This custom hook returns a configured axios instance.
const useApiClient = () => {
  const { getToken } = useAuth();

  // Create an axios instance with a base URL from environment variables.
  // In your .env file, you would have: REACT_APP_API_BASE_URL=https://localhost:7025/api
 const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:7025/api',
  });

  // Use an interceptor to add the JWT token from Clerk to every request.
  // This is the key to authenticating your frontend with your backend.
  apiClient.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  return apiClient;
};

export default useApiClient;
