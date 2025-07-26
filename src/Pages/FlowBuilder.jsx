import React from "react";
import { ReactFlowProvider } from "reactflow";
import FlowCanvas from "../flowBuilder/FLowCanvas";

export default function FlowBuilderPage() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}
