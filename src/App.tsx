// import "./App.css";
import "@xyflow/react/dist/style.css";
import { ReactFlow, Background, Controls } from "@xyflow/react";

function App() {
  return (
    <>
      {/* <h1>React Flow Sandbox</h1> */}
      <div style={{ height: "100vh", width: "100vw" }}>
        <ReactFlow>
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </>
  );
}

export default App;
