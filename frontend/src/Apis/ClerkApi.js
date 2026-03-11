import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { useMemo } from 'react';

/**
 * NOTE: The .NET backend already has JsonNamingPolicy.CamelCase configured
 * in Program.cs, so responses arrive as camelCase (id, name, definitionJson,
 * updatedAt) — no key transformation needed here.
 */
const useApiClient = () => {
  const { getToken } = useAuth();

  const apiClient = useMemo(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'https://flow-forge-2txl.onrender.com/api',
      timeout: 15000,
    });

    // Attach Clerk JWT to every request
    instance.interceptors.request.use(
      async (config) => {
        try {
          const token = await getToken();
          if (token) config.headers.Authorization = `Bearer ${token}`;
        } catch (err) {
          console.error('[API] Failed to retrieve auth token:', err);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Surface clean error messages from backend responses
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        const message =
          error?.response?.data?.message ||
          error?.response?.data?.title ||
          error?.message ||
          'An unexpected error occurred.';
        return Promise.reject(new Error(message));
      }
    );

    return instance;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return apiClient;
};

export default useApiClient;