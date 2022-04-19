export type Position = { x: number, y: number };

export type Grid = Set<StringifiedCell<Position>>;

export type StringifiedCell<P extends Position> = `${P["x"]};${P["y"]}`;


/**
 je parcours chaque element vivant de ma grille
 récupérer les voisin de ses elements vivant
 compter le nombre de voisin vivant
 appliquer la règles next gen sur la cell en cours
 pour chaque voisin de la cell (vivant ou non)
 appliquer les règles
 si toujours vivant à la next gen je rajoute dans la grille la position de la cell encours
 si mort a la next gen je remove la cell de la grille
 * N => 2N => même temps => O(1)
 *
 * N => 2N => 2 fois plus de temps => O(N)
 *
 * N => 2N => 4 fois plus de temps => O(N2)
 * */

// default neighbors for x = 0 and y = 0
const ABSOLUTE_NEIGHBORS: Position[] = [
  { x: 0, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: -1 },
  { x: 1, y: 0 },
  { x: -1, y: 1 },
  { x: -1, y: -1 },
  { x: -1, y: 0 },
  { x: 0, y: -1 }
];


export function isOriginCellNeighbor(
  { x: oX, y: oY }: Position,
  { x: cX, y: cY }: Position
): boolean {
  const dX = cX + oX;
  const dY = cY + oY;
  return dX <= 1 && dY <= 1;
}


export function computeNextGenerationCellStatus(
  nbOfNeighbors: number,
  isCurrentCellAlive: boolean
): boolean {
  return (isCurrentCellAlive && nbOfNeighbors === 2) || nbOfNeighbors === 3;
}

export function getNeighborPositions({ x, y }): Position[] {
  return ABSOLUTE_NEIGHBORS.map(cell => ({ x: cell.x + x, y: cell.y + y }));
}

export function getNbOfAliveNeighbors(grid: Grid, cell: Position): number {
  return getNeighborPositions(cell)
    .map(stringifyCell)
    .filter(stringifiedCell => isAlive(grid, stringifiedCell)).length;
}

export function stringifyCell({ x, y }: Position): StringifiedCell<Position> {
  return `${x};${y}`;
}

export function isAlive<P extends Position>(
  grid: Grid,
  stringifiedCell: StringifiedCell<P>
): boolean {
  return grid.has(stringifiedCell);
}

export function parseStringifyCell<P extends Position>(cell: StringifiedCell<P>): Position {
  const [x, y] = cell.split(";");
  return { x: Number(x), y: Number(y) };
}

export function addOrRemoveCellByStatus(
  grid: Grid,
  currentPosition: Position,
  isCellAlive: boolean
): boolean {
  const nbOfAliveNeighbors = getNbOfAliveNeighbors(grid, currentPosition);
  return computeNextGenerationCellStatus(nbOfAliveNeighbors, isCellAlive);
}

/*export function lambda(position: Position) {
  return (grid: Position[], currentPosition: Position, isCellAlive: boolean) => {
    return addOrRemoveCellByStatus(grid, position, isCellAlive);
  };
}*/

export function computeNextGeneration(grid: Position[]): Position[] {

  const gridSet: Grid = new Set(grid.map(stringifyCell));

  // @ts-ignore
  const alive = [...gridSet]
    .map(parseStringifyCell)
    /*.map(getNeighborPositions)*/
    .filter(currentCell => addOrRemoveCellByStatus(gridSet, currentCell, true))

  // @ts-ignore
  const dead = [...gridSet]
    .map(parseStringifyCell)
    /*.map(getNeighborPositions)*/
    .filter(currentCell => addOrRemoveCellByStatus(gridSet, currentCell, false))


  return [...alive, ...dead];
}

// export function computeNextGeneration(grid) {
// const fff = grid.filter(lam);
// }

// Set => tableau => filter(fn) => tableau => Set
// fn: position => addOrRemoveCellByStatus(grid, position)
