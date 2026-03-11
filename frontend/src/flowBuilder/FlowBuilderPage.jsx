import React from "react";
import { ReactFlowProvider } from "reactflow";
import FlowCanvas from "../flowBuilder/FLowCanvas";

/**
 * FlowBuilderPage wraps FlowCanvas with the ReactFlow context provider.
 * This file was previously empty — restored and fixed.
 */
export default function FlowBuilderPage() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}
