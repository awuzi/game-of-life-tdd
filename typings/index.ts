export type Coordinate = "x" | "y";

// export type Coordinates = Readonly<Record<Coordinate, number>>;
export type Cell = Record<Coordinate, number>;

export type Grid = Cell[];

export type GridSet = Set<StringifiedCell<Cell>>;

export type StringifiedCell<P extends Cell> = `${P["x"]};${P["y"]}`;

export type IGrid = {
  asArray(): Cell[];
  has(coordinate: StringifiedCell<Cell>): boolean;
  map(fn: <P extends Cell>(cell: StringifiedCell<P>) => Cell): Grid;
  filter(fn: (coordinate: Cell) => boolean): Grid;
  count(): number;
};
