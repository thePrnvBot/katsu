import { useEffect, useRef, useState } from "react";
import { useStore } from "./store/useStore";
import { World } from "./components/world";
import { Window } from "./components/window";
import { Minimap } from "./components/minimap";
import { SearchBar } from "./components/searchbar";
import { CommandMenu } from "./components/kbar/CommandMenu";

export default function App() {
  const moveCell = useStore((s) => s.moveCell);
  const currentCell = useStore((s) => s.currentCell);
  const grid = useStore((s) => s.grid);
  const windows = useStore((s) => s.windows);
  const addWindow = useStore((s) => s.addWindow);
  const setActiveWindow = useStore((s) => s.setActiveWindow);
  const [urlField, setUrlField] = useState("");
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
      if ((e.target as HTMLElement).closest("[cmdk-root]")) return;
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
    const newWindowId = crypto.randomUUID();
    addWindow({
      id: newWindowId,
      x: currentCell.x * grid.cellWidth + 100 + Math.random() * 50,
      y: currentCell.y * grid.cellHeight + 100 + Math.random() * 50,
      w: 600,
      h: 400,
      url: cleanUrl,
    });
    setActiveWindow(newWindowId);
  };

  const openSite = () => {
    const cleanUrl = normalizeUrl(urlField);
    if (!cleanUrl) return;
    openWindow(cleanUrl);
    setUrlField("");
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      <CommandMenu />
      <SearchBar
        url={urlField}
        openSite={openSite}
        handleChange={setUrlField}
      />
      <World>
        {windows.map((w) => (
          <Window key={w.id} windowId={w.id} />
        ))}
      </World>
      <Minimap />
    </div>
  );
}
