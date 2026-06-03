import React from "react";
import { Planetarium } from "./components/Planetarium";

const App: React.FC = () => {
  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#020617" }}>
      <Planetarium />
    </div>
  );
};

export default App;