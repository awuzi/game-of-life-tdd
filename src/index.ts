import type { GridSet, Cell, StringifiedCell } from "../typings";

const ABSOLUTE_NEIGHBORS: readonly Cell[] = [
  { x: 0, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: -1 },
  { x: 1, y: 0 },
  { x: -1, y: 1 },
  { x: -1, y: -1 },
  { x: -1, y: 0 },
  { x: 0, y: -1 },
];

export function computeNextGenerationCellStatus(nbOfNeighbors: number, isCurrentCellAlive: boolean): boolean {
  return (isCurrentCellAlive && nbOfNeighbors === 2) || nbOfNeighbors === 3;
}

export function getNeighborPositions({ x, y }): Cell[] {
  return ABSOLUTE_NEIGHBORS.map((cell) => ({ x: cell.x + x, y: cell.y + y }));
}

export function getAliveNeighbors(grid: GridSet, cell: Cell): `${number};${number}`[] {
  return getNeighborPositions(cell)
    .map(stringifyCell)
    .filter((stringifiedCell) => isAlive(grid, stringifiedCell));
}

export function stringifyCell({ x, y }: Cell): StringifiedCell<Cell> {
  return `${x};${y}`;
}

export function isAlive<P extends Cell>(grid: GridSet, stringifiedCell: StringifiedCell<P>): boolean {
  return grid.has(stringifiedCell);
}

export function parseStringifiedCell<P extends Cell>(cell: StringifiedCell<P>): Cell {
  const [x, y] = cell.split(";");
  return { x: Number(x), y: Number(y) };
}

export function addOrRemoveCellByStatus(grid: GridSet, currentPosition: Cell, isCellAlive: boolean): boolean {
  const nbOfAliveNeighbors = getAliveNeighbors(grid, currentPosition).length;
  return computeNextGenerationCellStatus(nbOfAliveNeighbors, isCellAlive);
}

export function computeNextGeneration(grid: Cell[]): Cell[] {
  const gridSet: GridSet = new Set(grid.map(stringifyCell));

  const newCells = [...gridSet]
    .map((c) => getNeighborPositions(parseStringifiedCell(c)))
    .flat()
    .filter((c) => addOrRemoveCellByStatus(gridSet, c, false))
    .map(stringifyCell);

  const stillAlive = [...gridSet]
    .filter((f) => isAlive(gridSet, f))
    .map(parseStringifiedCell)
    .filter((c) => addOrRemoveCellByStatus(gridSet, c, true))
    .map(stringifyCell);

  return [...new Set([...stillAlive, ...newCells])].map(parseStringifiedCell);
}
