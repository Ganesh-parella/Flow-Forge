import useApiClient from "./ClerkApi"; // Custom axios instance with Clerk token
import { useCallback } from "react";

export const useFlowApi = () => {
  const api = useApiClient(); // Authenticated axios instance

  // ---------------- FLOW MANAGEMENT ----------------

  const createFlow = useCallback(async (data) => {
    const response = await api.post('/flows', data);
    return response.data;
  }, [api]);

  const getFlowsByUser = useCallback(async () => {
    const response = await api.get('/flows/user/me');
    return response.data;
  }, [api]);

  const getFlowById = useCallback(async (id) => {
    const response = await api.get(`/flows/${id}`);
    return response.data;
  }, [api]);

  const updateFlow = useCallback(async (id, data) => {
    const response = await api.put(`/flows/${id}`, data);
    return response.data;
  }, [api]);

  const deleteFlow = useCallback(async (id) => {
    await api.delete(`/flows/${id}`);
  }, [api]);

  const runFlow = useCallback(async (id) => {
    const response = await api.post(`/flows/${id}/run`);
    return response.data;
  }, [api]);

  // ---------------- CONNECTION MANAGEMENT ----------------

  /**
   * Fetches the Google OAuth connect URL from the backend.
   * Backend returns: { url: "https://accounts.google.com/o/oauth2/auth?..." }
   */
  const getGoogleConnectUrl = useCallback(async () => {
    const response = await api.get('/connections/google/connect-url');
    return response.data; // { url: "...google auth URL..." }
  }, [api]);

  /**
   * Fetches the current connection status of all services.
   * Backend returns: { google: true/false }
   */
  const getConnections = useCallback(async () => {
    const response = await api.get('/connections');
    return response.data;
  }, [api]);

  /**
   * Disconnects Google for the current user.
   */
  const disconnectGoogle = useCallback(async () => {
    const response = await api.delete('/connections/google/disconnect');
    return response.data;
  }, [api]);

  return {
    // Flow endpoints
    createFlow,
    getFlowsByUser,
    getFlowById,
    updateFlow,
    deleteFlow,
    runFlow,

    // Connection endpoints
    getConnections,
    getGoogleConnectUrl,
    disconnectGoogle,
  };
};

export default useFlowApi;
