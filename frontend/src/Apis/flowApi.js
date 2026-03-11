import useApiClient from './ClerkApi';
import { useCallback } from 'react';

/**
 * All API calls.
 * Because ClerkApi normalises PascalCase → camelCase on every response,
 * callers can use flow.id, flow.name, flow.definitionJson, flow.updatedAt, etc.
 *
 * Backend endpoints (from FlowsController + ConnectionsController):
 *   POST   /api/flows                          → create flow
 *   GET    /api/flows/user/me                  → list user flows
 *   GET    /api/flows/:id                      → get single flow
 *   PUT    /api/flows/:id                      → update flow
 *   DELETE /api/flows/:id                      → delete flow
 *   POST   /api/flows/:id/run                  → trigger execution
 *   GET    /api/connections                    → { google: bool }
 *   GET    /api/connections/google/connect-url → { url: string }
 *   DELETE /api/connections/google/disconnect  → disconnect google
 */
export const useFlowApi = () => {
  const api = useApiClient();

  // ── Flow CRUD ──────────────────────────────────────────────────────────────

  const createFlow = useCallback(async (data) => {
    const res = await api.post('/flows', data);
    return res.data; // { id, name, definitionJson, updatedAt, createdAt, ... }
  }, [api]);

  const getFlowsByUser = useCallback(async () => {
    const res = await api.get('/flows/user/me');
    return res.data; // array of flow objects
  }, [api]);

  const getFlowById = useCallback(async (id) => {
    const res = await api.get(`/flows/${id}`);
    return res.data;
  }, [api]);

  const updateFlow = useCallback(async (id, data) => {
    const res = await api.put(`/flows/${id}`, data);
    return res.data;
  }, [api]);

  const deleteFlow = useCallback(async (id) => {
    await api.delete(`/flows/${id}`);
  }, [api]);

  // ── Execution ─────────────────────────────────────────────────────────────

  const runFlow = useCallback(async (id) => {
    const res = await api.post(`/flows/${id}/run`);
    return res.data; // { message: "Flow execution started." }
  }, [api]);

  // ── Connections ───────────────────────────────────────────────────────────

  /** Returns { url: "https://accounts.google.com/..." } */
  const getGoogleConnectUrl = useCallback(async () => {
    const res = await api.get('/connections/google/connect-url');
    return res.data;
  }, [api]);

  /** Returns { google: true | false } */
  const getConnections = useCallback(async () => {
    const res = await api.get('/connections');
    return res.data;
  }, [api]);

  const disconnectGoogle = useCallback(async () => {
    const res = await api.delete('/connections/google/disconnect');
    return res.data;
  }, [api]);

  return {
    createFlow,
    getFlowsByUser,
    getFlowById,
    updateFlow,
    deleteFlow,
    runFlow,
    getConnections,
    getGoogleConnectUrl,
    disconnectGoogle,
  };
};

export default useFlowApi;