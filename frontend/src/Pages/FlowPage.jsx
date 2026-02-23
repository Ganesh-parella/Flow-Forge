import React, { useEffect, useState, useCallback } from "react";
import { useFlowApi } from "../Apis/flowApi";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../Flows/Sidebar";
import FlowsList from "../Flows/FlowList";
import { DeleteDialog, RunDialog, CreateDialog } from "../Flows/Dialog";
import { Plus } from "lucide-react";

export default function FlowsPage() {
  const { getFlowsByUser, deleteFlow, runFlow, createFlow } = useFlowApi();
  const { isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();

  /* ---------------- STATE ---------------- */

  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedFlow, setSelectedFlow] = useState(null);

  const [deletingFlowId, setDeletingFlowId] = useState(null);
  const [runningFlowId, setRunningFlowId] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [runDialogOpen, setRunDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const [runMessage, setRunMessage] = useState("");
  const [newFlowName, setNewFlowName] = useState("");
  const [creatingFlow, setCreatingFlow] = useState(false);

  /* ---------------- FETCH FLOWS ---------------- */

  const fetchFlows = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getFlowsByUser();
      setFlows(data ?? []);
    } catch (error) {
      console.error("Error fetching flows:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      fetchFlows();
    } else {
      setLoading(false);
      setFlows([]);
    }
  }, [isLoaded, isSignedIn]);

  /* ---------------- EDIT ---------------- */

  const handleEdit = useCallback(
    (flow) => {
      navigate(`/flow-builder/${flow.id}`);
    },
    [navigate]
  );

  /* ---------------- DELETE ---------------- */

  const confirmDelete = useCallback((flow) => {
    setSelectedFlow(flow);
    setDeleteDialogOpen(true);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!selectedFlow?.id) return;

    try {
      setDeletingFlowId(selectedFlow.id);
      await deleteFlow(selectedFlow.id);
      await fetchFlows();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeletingFlowId(null);
      setDeleteDialogOpen(false);
      setSelectedFlow(null);
    }
  }, [selectedFlow, deleteFlow, fetchFlows]);

  /* ---------------- RUN ---------------- */

  const handleRun = useCallback(
    async (flow) => {
      try {
        setRunningFlowId(flow.id);
        await runFlow(flow.id);
        setRunMessage(
          `Flow "${flow.name || flow.id}" executed successfully!`
        );
      } catch (err) {
        console.error("Run failed:", err);
        setRunMessage(
          `Failed to run flow "${flow.name || flow.id}".`
        );
      } finally {
        setRunningFlowId(null);
        setRunDialogOpen(true);
      }
    },
    [runFlow]
  );

  /* ---------------- CREATE ---------------- */

  const handleCreateFlow = useCallback(async () => {
    if (!newFlowName.trim()) return;

    try {
      setCreatingFlow(true);

      const flow = await createFlow({
        name: newFlowName.trim(),
      });

      if (!flow?.id) {
        throw new Error("CreateFlow did not return an id.");
      }

      await fetchFlows();

      setCreateDialogOpen(false);
      setNewFlowName("");

      navigate(`/flow-builder/${flow.id}`);
    } catch (err) {
      console.error("Create flow failed:", err);
    } finally {
      setCreatingFlow(false);
    }
  }, [newFlowName, createFlow, fetchFlows, navigate]);

  /* ---------------- RENDER ---------------- */

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <main className="flex-1 px-4 py-6 sm:px-6 md:px-10 max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Your Flows
            </h1>
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

        {/* Floating Create Button */}
        <button
          onClick={() => setCreateDialogOpen(true)}
          aria-label="Create Flow"
          className="
            fixed bottom-6 right-6 sm:bottom-8 sm:right-8
            z-30 shadow-xl
            bg-primary text-white hover:bg-primary/90
            h-14 w-14 rounded-full
            flex items-center justify-center
            transition-all focus:ring-2 focus:ring-primary
          "
        >
          <Plus className="w-6 h-6" />
        </button>

        {/* Dialogs */}
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
          isLoading={deletingFlowId === selectedFlow?.id}
          flowName={
            selectedFlow?.name || `Flow ${selectedFlow?.id}`
          }
        />

        <RunDialog
          open={runDialogOpen}
          onClose={() => setRunDialogOpen(false)}
          message={runMessage}
        />
      </div>
    </div>
  );
}