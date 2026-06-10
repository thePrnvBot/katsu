import { useStore } from "../store/useStore";

const CELL_SIZE = 14;
const GAP = 1;

export function Minimap() {
  const grid = useStore((s) => s.grid);
  const currentCell = useStore((s) => s.currentCell);
  const moveToCell = useStore((s) => s.moveToCell);

  const w = grid.cols * (CELL_SIZE + GAP);
  const h = grid.rows * (CELL_SIZE + GAP);

  return (
    <div
      className="fixed bottom-4 right-4 z-9999 rounded-lg border border-white/10 bg-[#111] p-2"
      style={{ width: w + 16, height: h + 16 }}
    >
      <div className="relative" style={{ width: w, height: h }}>
        {Array.from({ length: grid.rows }).map((_, row) =>
          Array.from({ length: grid.cols }).map((_, col) => {
            const isCurrent = col === currentCell.x && row === currentCell.y;
            return (
              <button
                key={`${col}-${row}`}
                onClick={() => moveToCell(col, row)}
                className="absolute border-none transition-colors"
                style={{
                  left: col * (CELL_SIZE + GAP),
                  top: row * (CELL_SIZE + GAP),
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  borderRadius: 2,
                  background: isCurrent
                    ? "rgba(255,255,255,0.5)"
                    : "rgba(255,255,255,0.08)",
                  cursor: isCurrent ? "default" : "pointer",
                }}
              />
            );
          }),
        )}
      </div>
    </div>
  );
}
