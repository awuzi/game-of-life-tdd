export type Coordinate = "x" | "y";

export type Cell = Record<Coordinate, number >;

export type Grid = Cell[];

export type GridSet = Set<StringifiedCell<Cell>>;

export type StringifiedCell<P extends Cell> = `${P["x"]};${P["y"]}`;
