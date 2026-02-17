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
import { Trash2, Save, Play, Menu } from "lucide-react"; // FIX: Imported Menu icon
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
  // ... (Keep all your existing state and hook logic exactly the same) ...
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
    event.dataTransfer.setData("application/reactflow", JSON.stringify({ type: nodeType, initialData }));
    event.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback((event) => {
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

    setNodes((nds) => nds.concat({
      id: genId(), type, position, data: { ...initialData }, Istrigger: type === "trigger"
    }));
  }, [nodes, rfInstance, setNodes]);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)), [setEdges]);
  const onNodeClick = (_, node) => setSelectedNode(node);
  const onPaneClick = () => setSelectedNode(null);

  const deleteSelectedNode = () => {
    if (!selectedNode) return;
    setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setSelectedNode(null);
  };

  const onSave = async () => {
    if (!rfInstance || !user) return toast.error("Not ready.");
    const flowObj = rfInstance.toObject() || { nodes: [], edges: [] };
    const payload = { name: flowName.trim() || "Untitled Flow", definitionJson: JSON.stringify(flowObj) };

    try {
      if (flowId) {
        await updateFlow(flowId, payload);
        toast.success("Flow updated!");
      } else {
        const newFlow = await createFlow(payload);
        toast.success("Flow created!");
        navigate(`/flow-builder/${newFlow.id}`, { replace: true });
      }
    } catch (err) {
      toast.error("Failed to save flow.");
    }
  };

  const onRun = async () => {
    if (!flowId) return toast.error("Save first.");
    const toastId = toast.loading("Running...");
    try {
      await runFlow(flowId);
      toast.success("Execution started!", { id: toastId });
    } catch {
      toast.error("Failed to run.", { id: toastId });
    }
  };

  const updateNodeData = (mutator) => {
    if (!selectedNode) return;
    const updatedData = mutator(selectedNode.data);
    setNodes((nds) => nds.map((n) => (n.id === selectedNode.id ? { ...n, data: updatedData } : n)));
    setSelectedNode((prev) => ({ ...prev, data: updatedData }));
  };

  return (
    <div className="flex h-full w-full min-h-[calc(100vh-80px)] bg-background">
      <NodeLibrarySidebar onDragStart={onDragStart} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 relative overflow-hidden pb-20" ref={rfWrapper}>
        <ReactFlow
          nodes={nodes} edges={edges} nodeTypes={nodeTypes}
          onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
          onInit={setRfInstance} onConnect={onConnect} onDrop={onDrop}
          onDragOver={onDragOver} onNodeClick={onNodeClick} onPaneClick={onPaneClick} fitView
        >
          <MiniMap className="rounded bg-white shadow hidden sm:block" />
          <Background variant="dots" gap={14} size={1} />
          <Controls className="mb-16 sm:mb-0" />
        </ReactFlow>

        {/* FIX: Responsive Floating Controls */}
        <div className="absolute top-4 left-2 right-2 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto flex flex-col sm:flex-row gap-2 z-40 bg-white/90 sm:bg-white/80 rounded-xl p-2 shadow border">
          
          {/* Top row on mobile: Menu button & Input */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="icon" className="md:hidden shrink-0" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-4 h-4" />
            </Button>
            <Input
              className="flex-1 sm:w-64 h-9"
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
              placeholder="Flow Name"
            />
          </div>

          {/* Bottom row on mobile: Action buttons */}
          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <Button size="sm" onClick={onSave} className="flex-1 sm:flex-none">
              <Save className="w-4 h-4 sm:mr-1" /> <span className="hidden sm:inline">Save</span>
            </Button>
            {flowId && (
              <Button size="sm" variant="secondary" onClick={onRun} className="flex-1 sm:flex-none">
                <Play className="w-4 h-4 sm:mr-1" /> <span className="hidden sm:inline">Run</span>
              </Button>
            )}
            {selectedNode && (
              <Button size="sm" variant="destructive" onClick={deleteSelectedNode} className="flex-1 sm:flex-none">
                <Trash2 className="w-4 h-4 sm:mr-1" /> <span className="hidden sm:inline">Delete</span>
              </Button>
            )}
          </div>

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