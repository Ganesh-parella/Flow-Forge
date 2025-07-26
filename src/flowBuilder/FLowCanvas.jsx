import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import NodeLibrarySidebar from "./NodeLibrarySidebar";
import SettingsPanel from "./SettingPanel";
import {
  TriggerNode,
  ConditionNode,
  ActionNode,
  DelayNode,
  GoogleSheetsAddRowNode,
} from "./nodes";
import { genId } from "./utils";
import { useFlowApi } from "../Apis/flowApi";
import { Trash2, Save, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const nodeTypes = {
  trigger: TriggerNode,
  condition: ConditionNode,
  "gmail-send-action": ActionNode,
  "google-sheets-add-row-action": GoogleSheetsAddRowNode,
  "delay-action": DelayNode,
};

function FlowCanvas() {
  const rfWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [rfInstance, setRfInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [flowName, setFlowName] = useState("Untitled Flow");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { createFlow, updateFlow, getFlowById, runFlow } = useFlowApi();
  const { user } = useUser();
  const { id: flowId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!flowId) return;
    (async () => {
      try {
        const data = await getFlowById(flowId);
        if (data) {
          setFlowName(data.name || "Untitled Flow");
          if (data.definitionJson) {
            const parsed = JSON.parse(data.definitionJson);
            setNodes(parsed.nodes || []);
            setEdges(parsed.edges || []);
          }
        }
      } catch {
        toast.error("Failed to load flow");
      }
    })();
  }, [flowId]);

  const onDragStart = (event, nodeType, initialData) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ type: nodeType, initialData })
    );
    event.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const bounds = rfWrapper.current.getBoundingClientRect();
      const payload = event.dataTransfer.getData("application/reactflow");
      if (!payload) return;
      const { type, initialData } = JSON.parse(payload);
      if (type === "trigger" && nodes.some((n) => n.type === "trigger")) {
        toast.warning("Only one trigger allowed!");
        return;
      }
      const position = rfInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });
      setNodes((nds) => nds.concat({ id: genId(), type, position, data: { ...initialData } }));
    },
    [nodes, rfInstance, setNodes]
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const onNodeClick = (_, node) => setSelectedNode(node);
  const onPaneClick = () => setSelectedNode(null);

  const deleteSelectedNode = () => {
    if (!selectedNode) return;
    setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setSelectedNode(null);
  };

  const onSave = async () => {
    if (!rfInstance || !user) return;
    const flowObj = rfInstance.toObject();
    const payload = { name: flowName, definitionJson: JSON.stringify(flowObj) };
    try {
      if (flowId) {
        await updateFlow(flowId, payload);
        toast.success("Flow updated!");
        navigate("/flows");
      } else {
        const newFlow = await createFlow(payload);
        toast.success("Flow saved!");
        if (newFlow?.id) {
          navigate(`/flow-builder/${newFlow.id}`, { replace: true });
        } else {
          toast.error("No ID returned after creation.");
        }
      }
    } catch (err) {
      console.error("Save failed:", err);
      toast.error("Failed to save flow.");
    }
  };

  const onRun = async () => {
    if (!flowId) {
      toast.error("Please save the flow before running it.");
      return;
    }
    const toastId = toast.loading("Running flow...");
    try {
      await runFlow(flowId);
      toast.success(`Flow "${flowName}" execution started!`, { id: toastId });
    } catch (err) {
      toast.error("Failed to run flow.", { id: toastId });
      console.error(err);
    }
  };

  const updateNodeData = (mutator) => {
    if (!selectedNode) return;
    const updatedData = mutator(selectedNode.data);
    setNodes((nds) =>
      nds.map((n) => (n.id === selectedNode.id ? { ...n, data: updatedData } : n))
    );
    setSelectedNode((prev) => ({ ...prev, data: updatedData }));
  };

  return (
    <div className="flex h-full w-full min-h-screen bg-background">
      <NodeLibrarySidebar onDragStart={onDragStart} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div
        className="flex-1 relative overflow-hidden pb-20" // Ensures bottom strip is gone
        ref={rfWrapper}
        tabIndex={0}
        aria-label="Flow builder canvas"
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onInit={setRfInstance}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          fitView
        >
          <MiniMap className="rounded bg-white shadow" />
          <Background variant="dots" gap={14} size={1} />
          <Controls />
        </ReactFlow>

        {/* Floating Save / Run / Delete controls */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 z-40 bg-white/80 rounded-xl px-4 py-2 shadow border items-center">
          <Input
            className="w-64"
            value={flowName}
            onChange={(e) => setFlowName(e.target.value)}
            aria-label="Flow name"
          />
          <Button onClick={onSave}>
            <Save className="w-4 h-4 mr-1" /> Save
          </Button>
          {flowId && (
            <Button variant="secondary" onClick={onRun}>
              <Play className="w-4 h-4 mr-1" /> Run
            </Button>
          )}
          {selectedNode && (
            <Button variant="destructive" onClick={deleteSelectedNode}>
              <Trash2 className="w-4 h-4 mr-1" /> Delete
            </Button>
          )}
        </div>

        {/* Node settings panel */}
        {selectedNode && (
          <SettingsPanel node={selectedNode} updateNodeData={updateNodeData} flowId={flowId} />
        )}
      </div>
    </div>
  );
}

export default FlowCanvas;
