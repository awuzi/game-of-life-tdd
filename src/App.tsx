import { useEffect, useState } from "react";
import "./App.css";
import { Canvas } from "./Canvas";
import { computeNextGeneration } from "./";

const App = () => {
  const [currentGeneration, setCurrentGeneration] = useState([
    { x: 5, y: 3 },{ x: 6, y: 3 },
    { x: 4, y: 3 },{ x: 6, y: 5 },
    { x: 4, y: 5 },{ x: 6, y: 4 },
    { x: 1, y: 0 },{ x: 5, y: 5 },
    { x: 4, y: 4 },{ x: 2, y: 3 },
    { x: 4, y: 3 },{ x: 4, y: -3 },
    { x: 5, y: 3 },{ x: 6, y: -3 },
  ]);
  const [previousGeneration, setPreviousGeneration] = useState([]);

  useEffect(() => {
    const game = setInterval(() => {
      setPreviousGeneration(currentGeneration);
      setCurrentGeneration(computeNextGeneration(currentGeneration));
    }, 300);

    return () => clearInterval(game);
  });

  return (
    <div className="App">
      <Canvas currentGen={currentGeneration} oldGen={previousGeneration} />
    </div>
  );
};

export default App;
