import type { Bounds, State } from "../store/useStore";

export type WindowLayout =
  | "left_half"
  | "right_half"
  | "left_third"
  | "center_third"
  | "right_third"
  | "top_left_quarter"
  | "top_right_quarter"
  | "bottom_left_quarter"
  | "bottom_right_quarter";

const getCellViewport = (grid: State["grid"]) => ({
  cvw: grid.cellWidth,
  cvh: grid.cellHeight,
});

export const resolveLayout = (
  layout: WindowLayout,
  grid: State["grid"],
): Bounds => {
  const { cvw, cvh } = getCellViewport(grid);

  const halfW = cvw / 2;
  const thirdW = cvw / 3;
  const quarterW = cvw / 2;
  const quarterH = cvh / 2;

  switch (layout) {
    case "left_half":
      return { x: 0, y: 0, w: halfW, h: cvh };

    case "right_half":
      return { x: halfW, y: 0, w: halfW, h: cvh };

    case "left_third":
      return { x: 0, y: 0, w: thirdW, h: cvh };

    case "center_third":
      return { x: thirdW, y: 0, w: thirdW, h: cvh };

    case "right_third":
      return { x: thirdW * 2, y: 0, w: thirdW, h: cvh };

    case "top_left_quarter":
      return { x: 0, y: 0, w: quarterW, h: quarterH };

    case "top_right_quarter":
      return { x: quarterW, y: 0, w: quarterW, h: quarterH };

    case "bottom_left_quarter":
      return { x: 0, y: quarterH, w: quarterW, h: quarterH };

    case "bottom_right_quarter":
      return { x: quarterW, y: quarterH, w: quarterW, h: quarterH };
  }
};
