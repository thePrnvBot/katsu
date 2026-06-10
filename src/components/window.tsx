import { Rnd } from "react-rnd";
import { useStore } from "../store/useStore";
import { Maximize, X } from "lucide-react";

export function Window({ windowId }: { windowId: string }) {
  const win = useStore((s) => s.windows.find((w) => w.id === windowId));

  const updateWindow = useStore((s) => s.updateWindow);
  const activeWindowId = useStore((s) => s.activeWindowId);
  const setActiveWindow = useStore((s) => s.setActiveWindow);
  const maximizeWindow = useStore((s) => s.maximizeWindow);
  const centerOnWindow = useStore((s) => s.centerOnWindow);
  const bringToFront = useStore((s) => s.bringToFront);
  const removeWindow = useStore((s) => s.removeWindow);

  if (!win) return null;

  const isActive = activeWindowId === win.id;

  return (
    <Rnd
      size={{ width: win.w, height: win.h }}
      position={{ x: win.x, y: win.y }}
      minWidth={200}
      minHeight={120}
      enableResizing
      dragHandleClassName="titlebar"
      bounds={undefined}
      onDragStart={() => {
        setActiveWindow(win.id);
        bringToFront(win.id);
      }}
      onDragStop={(_, d) => {
        updateWindow(win.id, { x: d.x, y: d.y });
      }}
      onResizeStart={() => {
        setActiveWindow(win.id);
        bringToFront(win.id);
      }}
      onResizeStop={(_, __, ref, ___, pos) => {
        updateWindow(win.id, {
          x: pos.x,
          y: pos.y,
          w: parseInt(ref.style.width),
          h: parseInt(ref.style.height),
        });
      }}
      style={{
        zIndex: win.z ?? 1,
        border: isActive ? "2px solid #fff" : "1px solid #444",
        background: isActive ? "#1a1a1a" : "#111",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: 10,
      }}
    >
      {/* TITLE BAR (drag handle is automatic unless you restrict it) */}
      <div
        className={`titlebar flex h-9 items-center justify-between px-2.5 select-none ${
          isActive ? "bg-[#333]" : "bg-[#2a2a2a]"
        } text-[#ddd] cursor-grab`}
        onDoubleClick={() => centerOnWindow(win.id)}
      >
        <span className="w-10 shrink-0 opacity-50">{win.id.slice(0, 4)}</span>
        <span className="truncate text-center text-sm">{win.url}</span>

        <div className="flex shrink-0 items-center gap-0.5">
          <button
            onClick={() => maximizeWindow(win.id)}
            className="flex h-5.5 w-5.5 items-center justify-center text-[#aaa]"
          >
            <Maximize size={14} />
          </button>

          <button
            onClick={() => removeWindow(win.id)}
            className="flex h-5.5 w-5.5 items-center justify-center text-[#aaa]"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 bg-[#0f0f0f]">
        {win.url ? (
          <iframe src={win.url} className="h-full w-full border-0" />
        ) : (
          <div className="p-3 text-[#777]">Empty window</div>
        )}
      </div>
    </Rnd>
  );
}
