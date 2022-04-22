import { useEffect, useRef, useState } from "react";
import "./App.css";

export const Canvas = ({ previousConfiguration, configuration }) => {
  const canvasRef = useRef("canvas");

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    const SIDE_LENGTH = 10;

    context.fillStyle = "#FFFFFF";
    previousConfiguration.forEach((cell) =>
      context.fillRect(cell.x * SIDE_LENGTH, cell.y * SIDE_LENGTH, SIDE_LENGTH, SIDE_LENGTH)
    );

    context.fillStyle = "#FF0000";
    configuration.forEach((cell) =>
      context.fillRect(cell.x * SIDE_LENGTH, cell.y * SIDE_LENGTH, SIDE_LENGTH, SIDE_LENGTH)
    );
  }, [configuration, previousConfiguration]);

  return <canvas ref={canvasRef} className="canvas" height="200" width="200"></canvas>;
};
