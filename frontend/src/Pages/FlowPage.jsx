import React, { useEffect, useState, useCallback } from "react";
import { useFlowApi } from "../Apis/flowApi";
import { useUser } from "@clerk/clerk-react";
import { useNavigate, useLocation } from "react-router-dom";

import Sidebar from "../Flows/Sidebar";
import FlowsList from "../Flows/FlowList";
import { DeleteDialog, RunDialog, CreateDialog } from "../Flows/Dialog";
import { Plus } from "lucide-react";
export default function FlowsPage() {
  const { getFlowsByUser, deleteFlow, runFlow, createFlow } = useFlowApi();
  const { isLoaded, isSignedIn } = useUser();

  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deletingFlowId, setDeletingFlowId] = useState(null);
  const [runningFlowId, setRunningFlowId] = useState(null);

  const [selectedFlow, setSelectedFlow] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [runDialogOpen, setRunDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const [runMessage, setRunMessage] = useState("");
  const [newFlowName, setNewFlowName] = useState("");
  const [creatingFlow, setCreatingFlow] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const fetchFlows = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getFlowsByUser();
      setFlows(data || []);
    } catch (error) {
      console.error("Error fetching flows:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && isSignedIn) fetchFlows();
    else if (isLoaded && !isSignedIn) setLoading(false);
  }, [isLoaded, isSignedIn]);

  const confirmDelete = (flow) => {
    setSelectedFlow(flow);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedFlow) return;
    setDeletingFlowId(selectedFlow.id);
    try {
      await deleteFlow(selectedFlow.id);
      setDeleteDialogOpen(false);
      await fetchFlows();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeletingFlowId(null);
    }
  };

  const handleRun = async (flow) => {
    setRunningFlowId(flow.id);
    try {
      await runFlow(flow.id);
      setRunMessage(`Flow "${flow.name || flow.id}" executed successfully!`);
    } catch (err) {
      console.error("Run failed:", err);
      setRunMessage(`Failed to run flow "${flow.name || flow.id}".`);
    } finally {
      setRunDialogOpen(true);
      setRunningFlowId(null);
    }
  };

  const handleEdit = (flow) => {
    navigate(`/flow-builder/${flow.id}`);
  };

  const handleCreateFlow = async () => {
    if (!newFlowName.trim()) return;
    setCreatingFlow(true);
    try {
      const flow = await createFlow({ name: newFlowName.trim() });
      if (!flow || !flow.id) throw new Error("CreateFlow did not return an id.");
      setCreateDialogOpen(false);
      setNewFlowName("");
      await fetchFlows();
      navigate(`/flow-builder/${flow.id}`);
    } catch (err) {
      console.error("Create flow failed:", err);
    } finally {
      setCreatingFlow(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full" role="main" aria-label="User flows">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Your Flows</h1>
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

          {/* Floating Create Flow button */}
          <button
            className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-30 shadow-lg bg-primary text-white hover:bg-primary/80 h-14 w-14 rounded-full p-0 flex items-center justify-center transition-all focus:ring-2 focus:ring-primary"
            aria-label="Create Flow"
            onClick={() => setCreateDialogOpen(true)}
          >
            <Plus className="w-7 h-7" />
          </button>
        </main>

        <CreateDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onCreate={handleCreateFlow}
          isLoading={creatingFlow}
          newFlowName={newFlowName}
          setNewFlowName={setNewFlowName}
        />

        <DeleteDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          isLoading={deletingFlowId !== null}
          flowName={selectedFlow?.name || `Flow ${selectedFlow?.id}`}
        />

        <RunDialog open={runDialogOpen} onClose={() => setRunDialogOpen(false)} message={runMessage} />
      </div>
    </div>
  );
}