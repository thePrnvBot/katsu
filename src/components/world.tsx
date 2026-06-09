import { useStore } from "../store/useStore";

export function World({ children }: { children: React.ReactNode }) {
  const camera = useStore((s) => s.camera);
  const grid = useStore((s) => s.grid);

  const worldW = grid.cols * grid.cellWidth;
  const worldH = grid.rows * grid.cellHeight;

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#0a0a0a]">
      {/* world container */}
      <div
        className="absolute left-0 top-0"
        style={{
          width: worldW,
          height: worldH,
          transform: `translate3d(${-camera.x}px, ${-camera.y}px, 0)`,
          transformOrigin: "0 0",
        }}
      >
        {/* grid lines */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ zIndex: 0 }}
        >
          {Array.from({ length: grid.cols + 1 }).map((_, i) => (
            <line
              key={`v${i}`}
              x1={i * grid.cellWidth}
              y1={0}
              x2={i * grid.cellWidth}
              y2={worldH}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
          ))}
          {Array.from({ length: grid.rows + 1 }).map((_, i) => (
            <line
              key={`h${i}`}
              x1={0}
              y1={i * grid.cellHeight}
              x2={worldW}
              y2={i * grid.cellHeight}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
          ))}
        </svg>

        {/* content */}
        <div className="relative" style={{ zIndex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
