import React, { useEffect, useState, useCallback } from 'react';
import { useFlowApi } from '../Apis/flowApi';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import Sidebar from '../Flows/Sidebar';
import FlowsList from '../Flows/FlowList';
import { DeleteDialog, RunDialog, CreateDialog } from '../Flows/Dialog';
import { Plus } from 'lucide-react';

/**
 * FlowsPage
 *
 * Handler alignment with backend:
 *
 *   onEdit(flow)     → FlowCard passes the whole flow object → we use flow.id
 *   onDelete(flowId) → FlowCard passes flow.id (number)
 *   onRun(flowId)    → FlowCard passes flow.id (number)
 *
 * Backend: POST /api/flows/:id/run  returns { message: "Flow execution started." }
 * Backend: DELETE /api/flows/:id    returns 204 No Content
 */
export default function FlowsPage() {
  const { getFlowsByUser, deleteFlow, runFlow, createFlow } = useFlowApi();
  const { isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();

  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(true);

  // selectedFlow holds the full object so dialogs can display the name
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [deletingFlowId, setDeletingFlowId] = useState(null);
  const [runningFlowId, setRunningFlowId] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [runDialogOpen, setRunDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const [runMessage, setRunMessage] = useState('');
  const [newFlowName, setNewFlowName] = useState('');
  const [creatingFlow, setCreatingFlow] = useState(false);

  // ── Fetch ────────────────────────────────────────────────────────────────

  const fetchFlows = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getFlowsByUser();
      setFlows(data ?? []);
    } catch (err) {
      console.error('Error fetching flows:', err);
      toast.error(err.message || 'Failed to load flows.');
    } finally {
      setLoading(false);
    }
  }, [getFlowsByUser]);

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) fetchFlows();
    else setLoading(false);
  }, [isLoaded, isSignedIn, fetchFlows]);

  // ── Edit ─────────────────────────────────────────────────────────────────

  // FlowCard passes the whole flow object
  const handleEdit = (flow) => navigate(`/flow-builder/${flow.id}`);

  // ── Delete ───────────────────────────────────────────────────────────────

  // FlowCard calls onDelete(flow.id) → we receive the numeric id
  const confirmDelete = (flowId) => {
    const flow = flows.find((f) => f.id === flowId);
    setSelectedFlow(flow ?? { id: flowId, name: 'this flow' });
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedFlow) return;
    try {
      setDeletingFlowId(selectedFlow.id);
      await deleteFlow(selectedFlow.id);       // DELETE /api/flows/:id → 204
      toast.success('Flow deleted.');
      await fetchFlows();
    } catch (err) {
      toast.error(err.message || 'Failed to delete flow.');
    } finally {
      setDeletingFlowId(null);
      setDeleteDialogOpen(false);
      setSelectedFlow(null);
    }
  };

  // ── Run ──────────────────────────────────────────────────────────────────

  // FlowCard calls onRun(flow.id) → we receive the numeric id
  const handleRun = async (flowId) => {
    const flow = flows.find((f) => f.id === flowId);
    const flowName = flow?.name || 'Flow';
    try {
      setRunningFlowId(flowId);
      await runFlow(flowId);                   // POST /api/flows/:id/run → 202
      setRunMessage(`"${flowName}" execution started successfully!`);
    } catch (err) {
      setRunMessage(err.message || `Failed to run "${flowName}".`);
    } finally {
      setRunningFlowId(null);
      setRunDialogOpen(true);
    }
  };

  // ── Create ───────────────────────────────────────────────────────────────

  const handleCreateFlow = async () => {
    if (!newFlowName.trim()) return;
    try {
      setCreatingFlow(true);
      // POST /api/flows  body: { name } → returns new flow (camelCase after normalisation)
      const flow = await createFlow({ name: newFlowName.trim() });
      toast.success('Flow created!');
      setCreateDialogOpen(false);
      setNewFlowName('');
      navigate(`/flow-builder/${flow.id}`);
    } catch (err) {
      toast.error(err.message || 'Failed to create flow.');
    } finally {
      setCreatingFlow(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 px-4 sm:px-6 md:px-10 py-8 max-w-7xl mx-auto w-full">
          <div className="mb-8 animate-in fade-in-0 slide-in-from-top-2 duration-300">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Flows</h1>
            {!loading && (
              <p className="text-sm text-muted-foreground mt-1">
                {flows.length} {flows.length === 1 ? 'workflow' : 'workflows'}
              </p>
            )}
          </div>

          <FlowsList
            flows={flows}
            loading={loading}
            deletingFlowId={deletingFlowId}
            runningFlowId={runningFlowId}
            onEdit={handleEdit}
            onDelete={confirmDelete}
            onRun={handleRun}
            onCreate={() => setCreateDialogOpen(true)}
          />
        </main>
      </div>

      {/* Floating create button */}
      <button
        onClick={() => setCreateDialogOpen(true)}
        className="
          fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-30
          h-14 w-14 rounded-full
          bg-primary text-primary-foreground shadow-lg
          hover:bg-primary/90 hover:shadow-xl hover:scale-105
          active:scale-95
          transition-all duration-200 ease-out
          flex items-center justify-center
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        "
        aria-label="Create new flow"
      >
        <Plus className="w-6 h-6" />
      </button>

      <CreateDialog
        open={createDialogOpen}
        onClose={() => { setCreateDialogOpen(false); setNewFlowName(''); }}
        onCreate={handleCreateFlow}
        isLoading={creatingFlow}
        newFlowName={newFlowName}
        setNewFlowName={setNewFlowName}
      />
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        isLoading={deletingFlowId === selectedFlow?.id}
        flowName={selectedFlow?.name}
      />
      <RunDialog
        open={runDialogOpen}
        onClose={() => setRunDialogOpen(false)}
        message={runMessage}
      />
    </div>
  );
}