import { useEffect, useRef, useState } from "react";
import { useStore } from "./store/useStore";
import { World } from "./components/world";
import { Window } from "./components/window";
import { Minimap } from "./components/minimap";

export default function App() {
  const moveCell = useStore((s) => s.moveCell);
  const currentCell = useStore((s) => s.currentCell);
  const grid = useStore((s) => s.grid);
  const windows = useStore((s) => s.windows);
  const addWindow = useStore((s) => s.addWindow);
  const [url, setUrl] = useState("");
  const wheelAccum = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if ((e.target as HTMLElement)?.tagName === "IFRAME") return;

      const threshold = 80;
      wheelAccum.current.x += e.deltaX;
      wheelAccum.current.y += e.deltaY;

      if (Math.abs(wheelAccum.current.x) > threshold) {
        moveCell(wheelAccum.current.x > 0 ? 1 : -1, 0);
        wheelAccum.current.x = 0;
      }
      if (Math.abs(wheelAccum.current.y) > threshold) {
        moveCell(0, wheelAccum.current.y > 0 ? 1 : -1);
        wheelAccum.current.y = 0;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [moveCell]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowRight") moveCell(1, 0);
      if (e.key === "ArrowLeft") moveCell(-1, 0);
      if (e.key === "ArrowDown") moveCell(0, 1);
      if (e.key === "ArrowUp") moveCell(0, -1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [moveCell]);

  const normalizeUrl = (value: string) => {
    if (!value) return null;
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value;
    }
    return `https://${value}`;
  };

  const openWindow = (cleanUrl: string) => {
    addWindow({
      id: crypto.randomUUID(),
      x: currentCell.x * grid.cellWidth + 100 + Math.random() * 50,
      y: currentCell.y * grid.cellHeight + 100 + Math.random() * 50,
      w: 600,
      h: 400,
      url: cleanUrl,
    });
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="fixed left-1/2 top-2.5 z-9999 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#222] p-2">
        <span className="select-none px-4 pr-2 text-sm font-semibold text-[#eee]">
          Katsu
        </span>

        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const cleanUrl = normalizeUrl(url);
              if (!cleanUrl) return;
              openWindow(cleanUrl);
              setUrl("");
            }
          }}
          className="w-65 rounded-full border-none bg-[#333] px-4.5 py-2 text-sm text-[#eee] outline-none"
        />

        <button
          onClick={() => {
            const cleanUrl = normalizeUrl(url);
            if (!cleanUrl) return;
            openWindow(cleanUrl);
            setUrl("");
          }}
          className="cursor-pointer rounded-full border-none bg-[#444] px-4 py-2 text-sm text-[#eee]"
        >
          Open
        </button>
      </div>
      <World>
        {windows.map((w) => (
          <Window key={w.id} windowId={w.id} />
        ))}
      </World>
      <Minimap />
    </div>
  );
}
