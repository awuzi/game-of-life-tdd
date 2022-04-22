// @ts-ignore see https://github.com/jest-community/jest-extended#setup
import * as matchers from "jest-extended";
import {
  computeNextGenerationCellStatus,
  stringifyCell,
  getAliveNeighbors,
  getNeighborPositions,
  isAlive,
  addOrRemoveCellByStatus,
  parseStringifiedCell,
  computeNextGeneration
} from ".";

import type { Cell } from "../typings";

expect.extend(matchers);

describe("Next generation status by nbOfNeighbors", () => {
  it("Sould survive when a lived cell have 2 neighbors", () => {
    // given
    const nbOfNeighbors = 2;
    const isCellAlive = true;

    // when
    const result = computeNextGenerationCellStatus(nbOfNeighbors, isCellAlive);

    // then
    expect(result).toBe(true);
  });

  it("Sould survive when a lived cell have 3 neighbors", () => {
    // given
    const nbOfNeighbors = 3;
    const isCellAlive = true;

    // when
    const result = computeNextGenerationCellStatus(nbOfNeighbors, isCellAlive);

    // then
    expect(result).toBe(true);
  });

  it("Sould be created (alive) when a died cell have 3 neighbors", () => {
    // given
    const nbOfNeighbors = 3;
    const isCellAlive = false;
    // when
    const result = computeNextGenerationCellStatus(nbOfNeighbors, isCellAlive);
    // then
    expect(result).toBe(true);
  });

  it("Sould be dead when a cell have 4 or + neighbors", () => {
    // given
    const nbOfNeighbors = 4;
    const isCellAlive = true;
    // when
    const result = computeNextGenerationCellStatus(nbOfNeighbors, isCellAlive);

    // then
    expect(result).toBe(false);
  });

  it("Sould be dead when a cell have 1 neighbors", () => {
    // given
    const nbOfNeighbors = 1;
    const isCellAlive = true;
    // when
    const result = computeNextGenerationCellStatus(nbOfNeighbors, isCellAlive);

    // given
    expect(result).toBe(false);
  });
});

describe("Neighbors coordinate", () => {
  it("calculate neighbors coordinate", () => {

    // given
    const cell: Cell = { x: 5, y: 4 };

    // when
    const result = getNeighborPositions(cell);

    // then
    expect(result).toContainAllValues([
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
    // given
    const grid: Cell[] = [{ x: 7, y: 2 }];

    // when
    const result = isAlive(new Set(grid.map(stringifyCell)), "7;1");

    // then
    expect(result).toBe(false);
  });

  it("is alive", () => {
    // given
    const grid: Cell[] = [{ x: 7, y: 2 }];

    // when
    const result = isAlive(new Set(grid.map(stringifyCell)), "7;2");

    // then
    expect(result).toBe(true);
  });
});

describe("Alive neighbors", () => {
  it("should have 0 alive neighbors", () => {
    // given
    const grid: Cell[] = [{ x: 7, y: 2 }];

    // when
    const result = getAliveNeighbors(new Set(grid.map(stringifyCell)), { x: 0, y: 0 });

    // then
    expect(result).toHaveLength(0);
  });

  it("should have 1 alive neighbors", () => {
    // given
    const grid: Cell[] = [{ x: 7, y: 2 }];

    // when
    const result = getAliveNeighbors(new Set(grid.map(stringifyCell)), { x: 7, y: 1 });

    // then
    expect(result).toHaveLength(1);
  });
});

describe("Format to string set", () => {
  it("should format to \"2;3\" for {x:3, y:3}", () => {
    // given
    const cell: Cell = { x: 2, y: 3 };

    // when
    const result = stringifyCell(cell);

    // then
    expect(result).toEqual("2;3");
  });
});

describe("Parse string set", () => {
  it("should parse \'2;3\' to { x:3, y:3 }", () => {
    // given
    const stringCell = "2;3";

    // when
    const result = parseStringifiedCell<Cell>(stringCell);

    // then
    expect(result).toEqual({ x: 2, y: 3 });
  });
});

describe("Create or remove cell", () => {
  it("should add new cell when we have 3 neighbors", () => {
    // given
    const position = { x: 3, y: 3 };
    const grid = [
      { x: 3, y: 2 },
      { x: 2, y: 3 },
      { x: 4, y: 3 }
    ];
    const gridSet = new Set(grid.map(stringifyCell));

    // when
    const result = addOrRemoveCellByStatus(gridSet, position, true);

    // then
    expect(result).toBe(true);
  });

  it("should not add new position when we have 2 neighbors and current cell not alive", () => {
    // given
    const position = { x: 3, y: 3 };
    const grid = [
      { x: 2, y: 3 },
      { x: 4, y: 3 }
    ];
    const gridSet = new Set(grid.map(stringifyCell));

    // when
    const result = addOrRemoveCellByStatus(gridSet, position, false);

    // then
    expect(result).toBe(false);
  });

  it("should add new position when we have 2 neighbors and current cell is alive", () => {
    // given
    const position = { x: 3, y: 3 };
    const grid = [
      { x: 2, y: 3 },
      { x: 4, y: 3 }
    ];
    const gridSet = new Set(grid.map(stringifyCell));

    // when
    const result = addOrRemoveCellByStatus(gridSet, position, true);

    // then
    expect(result).toBe(true);
  });

  it("should not add new position when we have 4 neighbors and current cell is alive", () => {
    // given
    const position = { x: 3, y: 3 };
    const grid = [
      { x: 2, y: 3 },
      { x: 3, y: 2 },
      { x: 4, y: 2 },
      { x: 4, y: 3 }
    ];
    const gridSet = new Set(grid.map(stringifyCell));

    // when
    const result = addOrRemoveCellByStatus(gridSet, position, true);

    // then
    expect(result).toBe(false);
  });
});

describe("Compute generation", function() {
  it("Any live cell with two or three live neighbours lives on to the next generation", () => {
    // given
    const grid = [
      { x: 1, y: 0 },
      { x: 0, y: 0 },
      { x: -1, y: 0 }
    ];

    // when
    const result = computeNextGeneration(grid);

    // then
    expect(result).toContainAllValues([
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 }
    ]);
  });

  it("Any live cell with fewer than two live neighbours dies, as if by underpopulation", () => {
    // given
    const grid = [
      { x: 1, y: 0 },
      { x: 3, y: 1 }
    ];

    // when
    const result = computeNextGeneration(grid);

    // then
    expect(result).toBeEmpty();
  });

  it("Any live cell with more than three live neighbours dies, as if by overpopulation", () => {
    // given
    const grid = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 }
    ];

    // when
    const result = computeNextGeneration(grid);

    // then
    expect(result).toContainAllValues([
      { x: 0, y: 1 },
      { x: 0, y: 0 },
      { x: 1, y: -1 },
      { x: 2, y: 0 },
      { x: 2, y: 1 }
    ]);
  });

  it("Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction", () => {

    // given
    const grid = [
      { x: 0, y: -1 },
      { x: 1, y: 1 },
      { x: -1, y: 1 }
    ];

    // when
    const result = computeNextGeneration(grid);

    // then
    expect(result).toContainAllValues([
      { x: 0, y: 0 }
    ]);
  });

});

describe("Miscellaneous cases", () => {
  it("static square pattern", () => {
    // given
    const grid = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 }
    ];

    // when
    const result = computeNextGeneration(grid);

    // then
    expect(result).toContainAllValues([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 }
    ]);
  });

  it("periodic pattern --- => | => --- after 2 gen", () => {
    // given
    const grid = [
      { x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: 1, y: 0 }
    ];

    // when
    const result = computeNextGeneration(computeNextGeneration(grid));

    // then
    expect(result).toContainAllValues([
      { x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: 1, y: 0 }
    ]);

  });
});
