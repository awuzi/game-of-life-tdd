import type { GridSet, Cell, StringifiedCell, IGrid, Grid } from "../typings";

const ABSOLUTE_NEIGHBORS: readonly Cell[] = [
  { x: 0, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: -1 },
  { x: 1, y: 0 },
  { x: -1, y: 1 },
  { x: -1, y: -1 },
  { x: -1, y: 0 },
  { x: 0, y: -1 }
];

export function computeNextGenerationCellStatus(
  nbOfNeighbors: number,
  isCurrentCellAlive: boolean
): boolean {
  return (isCurrentCellAlive && nbOfNeighbors === 2) || nbOfNeighbors === 3;
}

export function getNeighborPositions({ x, y }): Cell[] {
  return ABSOLUTE_NEIGHBORS.map(cell => ({
    x: cell.x + x,
    y: cell.y + y
  }));
}

export function getAliveNeighbors(grid: GridSet, cell: Cell): StringifiedCell<Cell>[] {
  return getNeighborPositions(cell)
    .map(stringifyCell)
    .filter(isAlive(grid));
}

export function stringifyCell({ x, y }: Cell): StringifiedCell<Cell> {
  return `${x};${y}`;
}

export function isAlive<P extends Cell>(grid: GridSet): (stringifiedCell: StringifiedCell<P>) => boolean {
  return (stringifiedCell: StringifiedCell<P>): boolean => {
    return grid.has(stringifiedCell);
  };
}

export function parseStringifiedCell<P extends Cell>(cell: StringifiedCell<P>): Cell {
  const [x, y] = cell.split(";");
  return { x: Number(x), y: Number(y) };
}

export function addOrRemoveCellByStatus(
  grid: GridSet,
  currentPosition: Cell,
  isCellAlive: boolean
): boolean {
  const nbOfAliveNeighbors = getAliveNeighbors(grid, currentPosition).length;
  return computeNextGenerationCellStatus(nbOfAliveNeighbors, isCellAlive);
}

export function computeNextGeneration(grid: Cell[]): Cell[] {
  const gridSet: GridSet = new Set(grid.map(stringifyCell));

  const newCells = grid
    .map(getNeighborPositions)
    .flat()
    .filter(c => addOrRemoveCellByStatus(gridSet, c, false))
    .map(stringifyCell);

  const stillAlive = [...gridSet]
    .filter(isAlive(gridSet))
    .map(parseStringifiedCell)
    .filter(c => addOrRemoveCellByStatus(gridSet, c, true))
    .map(stringifyCell);

  return [...new Set([...stillAlive, ...newCells])].map(parseStringifiedCell);
}

export function gridHelper(grid: GridSet): IGrid {

  return {
    asArray(): Cell[] {
      return this.map(parseStringifiedCell);
    },
    has(coordinate: StringifiedCell<Cell>): boolean {
      return grid.has(coordinate);
    },
    map(fn: <P extends Cell>(cell: StringifiedCell<P>) => Cell): Grid {
      return [...grid].map(fn).flat();
    },
    filter(fn: (coordinate: Cell) => boolean): Grid {
      return this.asArray().filter(fn);
    },
    count(): number {
      return [...grid].length;
    }
  };
}
