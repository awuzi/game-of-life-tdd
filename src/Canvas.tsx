import { useEffect, useRef } from "react";
import "./App.css";
import { Cell } from "../typings";

type Props = {
  currentGen: Cell[],
  oldGen: Cell[]
}

export const Canvas = ({ currentGen, oldGen }: Props) => {
  const canvasRef = useRef("canvas");
  const SIDE_LENGTH = 10;

  useEffect(() => {
    const canvas = canvasRef.current as unknown as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 200, 200);
    ctx.fillStyle = "#FF0000";
    currentGen.forEach(drawCell(ctx));
  }, [currentGen, oldGen]);


  const drawCell = (ctx: CanvasRenderingContext2D): ({ x, y }: Cell) => void => ({ x, y }: Cell) => ctx.fillRect(x * SIDE_LENGTH, y * SIDE_LENGTH, SIDE_LENGTH, SIDE_LENGTH);

  return <canvas ref={canvasRef} className="canvas" height="200" width="200"></canvas>;
};
