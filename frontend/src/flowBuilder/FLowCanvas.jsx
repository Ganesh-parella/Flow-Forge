import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  useReactFlow, // <-- Added for mobile tap-to-add coordinates
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';
import NodeLibrarySidebar from './NodeLibrarySidebar';
import SettingsPanel from './SettingPanel';
import {
  TriggerNode,
  ConditionNode,
  ActionNode,
  DelayNode,
  GoogleSheetsAddRowNode,
} from './nodes';
import { genId } from './utils';
import { useFlowApi } from '../Apis/flowApi';
import { Trash2, Save, Play, Menu, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const nodeTypes = {
  trigger: TriggerNode,
  condition: ConditionNode,
  'gmail-send-action': ActionNode,
  'google-sheets-add-row-action': GoogleSheetsAddRowNode,
  'delay-action': DelayNode,
};

function FlowCanvas() {
  const rfWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [rfInstance, setRfInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [flowName, setFlowName] = useState('Untitled Flow');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);

  // Hook to calculate correct canvas coordinates for mobile taps
  const { screenToFlowPosition } = useReactFlow();

  const { createFlow, updateFlow, getFlowById, runFlow } = useFlowApi();
  const { user } = useUser();
  const { id: flowId } = useParams();
  const navigate = useNavigate();

  // ── Load existing flow ──────────────────────────────────────────────────
  useEffect(() => {
    if (!flowId) return;
    (async () => {
      try {
        const data = await getFlowById(flowId);
        if (data) {
          setFlowName(data.name || 'Untitled Flow');
          if (data.definitionJson) {
            const parsed = JSON.parse(data.definitionJson);
            setNodes(parsed.nodes || []);
            setEdges(parsed.edges || []);
          }
        }
      } catch (err) {
        toast.error(err.message || 'Failed to load flow.');
      }
    })();
  }, [flowId]); // eslint-disable-line

  // ── Drag & Drop (PC) ─────────────────────────────────────────────────────

  const onDragStart = (event, nodeType, initialData) => {
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify({ type: nodeType, initialData })
    );
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const bounds = rfWrapper.current?.getBoundingClientRect();
      if (!bounds || !rfInstance) return;

      const payload = event.dataTransfer.getData('application/reactflow');
      if (!payload) return;

      const { type, initialData } = JSON.parse(payload);

      if (type === 'trigger' && nodes.some((n) => n.type === 'trigger')) {
        toast.warning('Only one trigger node is allowed per flow.');
        return;
      }

      const position = rfInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      setNodes((nds) =>
        nds.concat({ id: genId(), type, position, data: { ...initialData } })
      );
    },
    [nodes, rfInstance, setNodes]
  );

  // ── Tap to Add (Mobile) ──────────────────────────────────────────────────

  const handleTapToAdd = useCallback((nodeType, initialData) => {
    if (!rfWrapper.current) return;

    if (nodeType === 'trigger' && nodes.some((n) => n.type === 'trigger')) {
      toast.warning('Only one trigger node is allowed per flow.');
      return;
    }

    // Get the canvas boundaries
    const bounds = rfWrapper.current.getBoundingClientRect();
    
    // Drop the node right in the middle of the screen
    const position = screenToFlowPosition({
      x: bounds.left + bounds.width / 2,
      y: bounds.top + bounds.height / 2,
    });

    setNodes((nds) =>
      nds.concat({ id: genId(), type: nodeType, position, data: { ...initialData } })
    );

    // Auto-close sidebar on mobile after tapping
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [nodes, screenToFlowPosition, setNodes]);

  // ── Canvas events ────────────────────────────────────────────────────────

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_, node) => setSelectedNode(node), []);
  const onPaneClick = useCallback(() => setSelectedNode(null), []);

  const deleteSelectedNode = () => {
    if (!selectedNode) return;
    setEdges((eds) =>
      eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id)
    );
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setSelectedNode(null);
  };

  // ── Save ─────────────────────────────────────────────────────────────────

  const onSave = async () => {
    if (!rfInstance || !user) return toast.error('Not ready to save.');
    setSaving(true);

    const flowObj = rfInstance.toObject();
    const payload = {
      name: flowName.trim() || 'Untitled Flow',
      definitionJson: JSON.stringify(flowObj),
    };

    try {
      if (flowId) {
        await updateFlow(flowId, payload);
        toast.success('Flow saved!');
      } else {
        const newFlow = await createFlow(payload);
        toast.success('Flow created!');
        navigate(`/flow-builder/${newFlow.id}`, { replace: true });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save flow.');
    } finally {
      setSaving(false);
    }
  };

  // ── Run ──────────────────────────────────────────────────────────────────

  const onRun = async () => {
    if (!flowId) return toast.error('Save your flow first.');
    setRunning(true);
    const toastId = toast.loading('Starting execution…');
    try {
      await runFlow(flowId);
      toast.success('Execution started!', { id: toastId });
    } catch (err) {
      toast.error(err.message || 'Execution failed.', { id: toastId });
    } finally {
      setRunning(false);
    }
  };

  // ── Node data update ─────────────────────────────────────────────────────

  const updateNodeData = useCallback(
    (mutator) => {
      if (!selectedNode) return;
      const updatedData = mutator(selectedNode.data);
      setNodes((nds) =>
        nds.map((n) => (n.id === selectedNode.id ? { ...n, data: updatedData } : n))
      );
      setSelectedNode((prev) => ({ ...prev, data: updatedData }));
    },
    [selectedNode, setNodes]
  );

  return (
    <div className="flex h-full w-full min-h-[calc(100vh-80px)] bg-background">
      <NodeLibrarySidebar
        onDragStart={onDragStart}
        onTapToAdd={handleTapToAdd} // <-- Passed here
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 relative overflow-hidden" ref={rfWrapper}>
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
          deleteKeyCode={null}
        >
          <MiniMap className="rounded-lg bg-white shadow hidden sm:block" nodeStrokeWidth={3} />
          <Background variant="dots" gap={14} size={1} color="#d1d5db" />
          <Controls className="mb-16 sm:mb-0" />
        </ReactFlow>

        {/* Floating toolbar */}
        <div className="
          absolute top-4 left-2 right-2
          sm:left-1/2 sm:right-auto sm:-translate-x-1/2
          flex flex-col sm:flex-row gap-2 z-40
          bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2.5
          shadow-lg border border-border/60
          animate-in fade-in-0 slide-in-from-top-2 duration-300
        ">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="icon"
              className="md:hidden h-9 w-9 shrink-0"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open node library"
            >
              <Menu className="w-4 h-4" />
            </Button>
            <Input
              className="flex-1 sm:w-56 h-9 text-sm"
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
              placeholder="Flow name…"
              aria-label="Flow name"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              size="sm"
              onClick={onSave}
              disabled={saving}
              className="flex-1 sm:flex-none gap-1.5 h-9"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{saving ? 'Saving…' : 'Save'}</span>
            </Button>

            {flowId && (
              <Button
                size="sm"
                variant="secondary"
                onClick={onRun}
                disabled={running}
                className="flex-1 sm:flex-none gap-1.5 h-9"
              >
                {running ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{running ? 'Running…' : 'Run'}</span>
              </Button>
            )}

            {selectedNode && (
              <Button
                size="sm"
                variant="destructive"
                onClick={deleteSelectedNode}
                className="flex-1 sm:flex-none gap-1.5 h-9 animate-in fade-in-0 zoom-in-95 duration-150"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            )}
          </div>
        </div>

        {selectedNode && (
          <SettingsPanel
            node={selectedNode}
            updateNodeData={updateNodeData}
            flowId={flowId}
          />
        )}
      </div>
    </div>
  );
}

export default FlowCanvas;