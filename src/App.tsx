import { useEffect, useState } from "react";
import "./App.css";
import { Canvas } from "./Canvas";
import { computeNextGeneration } from "./";

const App = () => {
  const [currentConfiguration, setCurrentConfiguration] = useState([
    { x: 5, y: 3 },
    { x: 4, y: 3 },
    { x: 4, y: 5 },
    { x: 1, y: 0 },
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: 4, y: 4 },
    { x: 6, y: 3 },
    { x: 6, y: 5 },
    { x: 6, y: 4 },
    { x: 5, y: 5 },
    { x: 2, y: 3 },
    { x: 4, y: 3 },
  ]);
  const [previousConfiguration, setPreviousConfiguration] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPreviousConfiguration(currentConfiguration);
      setCurrentConfiguration(computeNextGeneration(currentConfiguration));
    }, 500);
    return () => clearInterval(interval);
  });

  return (
    <div className="App">
      <Canvas configuration={currentConfiguration} previousConfiguration={previousConfiguration} />
    </div>
  );
};

export default App;
