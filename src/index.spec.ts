// @ts-ignore see https://github.com/jest-community/jest-extended#setup
import * as matchers from "jest-extended";
import {
  computeNextGenerationCellStatus,
  stringifyCell,
  getNbOfAliveNeighbors,
  getNeighborPositions,
  isAlive,
  isOriginCellNeighbor, addOrRemoveCellByStatus, parseStringifyCell, computeNextGeneration
} from ".";

import type {
  Grid,
  Position
} from ".";

expect.extend(matchers);

// une cellule se créer dans une case vide si elle a 3 voisines
// une cellule ayant 0, 1, 4 et + voisines meurt
// une cellule (vivante) avec deux ou trois voisines >survit< à la prochaine génération.
// j'ai une cellule, est-ce qu'elle est encore vivante à la génération d'après ?

describe("Next generation status by nbOfNeighbors", () => {
  it("Sould survive when a lived cell have 2 neighbors", () => {
    const nbOfNeighbors = 2;
    const isCellAlive = true;

    const result = computeNextGenerationCellStatus(nbOfNeighbors, isCellAlive);
    expect(result).toBe(true);
  });

  it("Sould survive when a lived cell have 3 neighbors", () => {
    const nbOfNeighbors = 3;
    const isCellAlive = true;
    const result = computeNextGenerationCellStatus(nbOfNeighbors, isCellAlive);
    expect(result).toBe(true);
  });

  it("Sould be created (alive) when a died cell have 3 neighbors", () => {
    const nbOfNeighbors = 3;
    const isCellAlive = false;
    const result = computeNextGenerationCellStatus(nbOfNeighbors, isCellAlive);
    expect(result).toBe(true);
  });

  it("Sould be dead when a cell have 4 or + neighbors", () => {
    const nbOfNeighbors = 4;
    const isCellAlive = true;
    const result = computeNextGenerationCellStatus(nbOfNeighbors, isCellAlive);
    expect(result).toBe(false);
  });

  it("Sould be dead when a cell have 1 neighbors", () => {
    const nbOfNeighbors = 1;
    const isCellAlive = true;
    const result = computeNextGenerationCellStatus(nbOfNeighbors, isCellAlive);
    expect(result).toBe(false);
  });
});

describe("Is a neighbor of the current cell position", () => {

  it("Should { x: 1, y: 1 } be a neighbor of { x: 0, y: 0 }", () => {
    const originCellPosition = { x: 0, y: 0 };
    const currentCell = { x: 1, y: 1 };
    expect(isOriginCellNeighbor(originCellPosition, currentCell)).toBe(true);
  });

  it("Should { x: -1, y: -1 } be a neighbor of { x: 0, y: 0 }", () => {
    const originCellPosition = { x: 0, y: 0 };
    const currentCell = { x: -1, y: 0 };
    expect(isOriginCellNeighbor(originCellPosition, currentCell)).toBe(true);
  });

  it("Should not { x: 3, y: 2 } be a neighbor of { x: 0, y: 0 }", () => {
    const originCellPosition = { x: 0, y: 0 };
    const currentCell = { x: 3, y: 2 };
    expect(isOriginCellNeighbor(originCellPosition, currentCell)).toBeFalse();
  });
});

describe("Neighbors coordinate", () => {
  it("calculate neighbors coordinate", () => {
    const cell: Position = { x: 5, y: 4 };
    expect(getNeighborPositions(cell)).toContainAllValues([
      { x: 5, y: 3 },
      { x: 4, y: 3 },
      { x: 4, y: 5 },
      { x: 4, y: 4 },
      { x: 6, y: 3 },
      { x: 6, y: 5 },
      { x: 6, y: 4 },
      { x: 5, y: 5 }
    ]);
  });
});

describe("Cell status", () => {
  it("is dead", () => {
    const grid: Position[] = [{ x: 7, y: 2 }];
    expect(isAlive(new Set(grid.map(stringifyCell)), "7;1")).toBe(false);
  });
  it("is alive", () => {
    const grid: Position[] = [{ x: 7, y: 2 }];
    expect(isAlive(new Set(grid.map(stringifyCell)), "7;2")).toBe(true);
  });
});

describe("Alive neighbors", () => {
  it("should have 0 alive neighbors", () => {
    const grid: Position[] = [{ x: 7, y: 2 }];
    expect(getNbOfAliveNeighbors(new Set(grid.map(stringifyCell)), { x: 0, y: 0 })).toBe(0);
  });

  it("should have 1 alive neighbors", () => {
    const grid: Position[] = [{ x: 7, y: 2 }];
    expect(getNbOfAliveNeighbors(new Set(grid.map(stringifyCell)), { x: 7, y: 1 })).toBe(1);
  });
});

describe("Format to string set", () => {
  it("should format to \"2;3\" for {x:3, y:3}", () => {
    expect(stringifyCell({ x: 2, y: 3 })).toEqual("2;3");
  });
});

describe("Format to string set", () => {
  it("should parse \"2;3\" to {x:3, y:3}", () => {
    expect(parseStringifyCell<Position>("2;3")).toEqual({ x: 2, y: 3 });
  });
});

describe("Create or remove cell", () => {

  it("should add new cell when we have 3 neighbors", () => {
    const position = { x: 3, y: 3 };
    const grid = [
      { x: 3, y: 2 },
      { x: 2, y: 3 },
      { x: 4, y: 3 }
    ];

    expect(addOrRemoveCellByStatus(new Set(grid.map(stringifyCell)), position, true))
      .toBe(true);
  });

  it("should not add new position when we have 2 neighbors and current cell not alive", () => {
    const position = { x: 3, y: 3 };
    const grid = [
      { x: 2, y: 3 },
      { x: 4, y: 3 }
    ];

    expect(addOrRemoveCellByStatus(new Set(grid.map(stringifyCell)), position, false))
      .toBe(false);
  });

  it("should add new position when we have 2 neighbors and current cell is alive", () => {
    const position = { x: 3, y: 3 };
    const grid = [
      { x: 2, y: 3 },
      { x: 4, y: 3 }
    ];

    expect(addOrRemoveCellByStatus(new Set(grid.map(stringifyCell)), position, true))
      .toBe(true);
  });


  it("should not add new position when we have 4 neighbors and current cell is alive", () => {
    const position = { x: 3, y: 3 };
    const grid = [
      { x: 2, y: 3 },
      { x: 3, y: 2 },
      { x: 4, y: 2 },
      { x: 4, y: 3 }
    ];

    expect(addOrRemoveCellByStatus(new Set(grid.map(stringifyCell)), position, true))
      .toBe(false);
  });
});

describe("computeNextGeneration", function() {

  it('get next generation', () => {
    const grid = [
      { x: 0, y: 1 },
      { x: 0, y: 0 },
      { x: 0, y: -1 }
    ];
    expect(computeNextGeneration(grid))
      .toContainAllValues([{ x: 1, y:  0 }, { x: 0, y: 0 }, { x: -1, y: 0 }]);
  });
});
