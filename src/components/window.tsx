import { useRef } from "react";
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

  const dragging = useRef(false);
  const resizing = useRef(false);

  if (!win) return null;

  const isActive = activeWindowId === win.id;

  return (
    <div
      data-window
      className="absolute flex flex-col overflow-hidden rounded-[10px]"
      style={{
        left: win.x,
        top: win.y,
        width: win.w,
        height: win.h,
        zIndex: win.z ?? 1,
        border: isActive ? "2px solid #fff" : "1px solid #444",
        background: isActive ? "#1a1a1a" : "#111",
      }}
    >
      {/* TITLE BAR */}
      <div
        className={`flex h-9 cursor-grab items-center justify-between px-2.5 select-none ${isActive ? "bg-[#333]" : "bg-[#2a2a2a]"} text-[#ddd]`}
        onDoubleClick={() => centerOnWindow(win.id)}
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).tagName === "BUTTON") return;

          setActiveWindow(win.id);
          bringToFront(win.id);

          dragging.current = true;

          const startX = e.clientX;
          const startY = e.clientY;
          const baseX = win.x;
          const baseY = win.y;

          const el = e.currentTarget;
          el.setPointerCapture(e.pointerId);

          const onMove = (ev: PointerEvent) => {
            if (!dragging.current) return;

            updateWindow(win.id, {
              x: baseX + (ev.clientX - startX),
              y: baseY + (ev.clientY - startY),
            });
          };

          const onUp = () => {
            dragging.current = false;
            el.removeEventListener("pointermove", onMove);
            el.removeEventListener("pointerup", onUp);
          };

          el.addEventListener("pointermove", onMove);
          el.addEventListener("pointerup", onUp);
        }}
      >
        <span className="w-10 shrink-0 opacity-50">{win.id.slice(0, 4)}</span>
        <span className="truncate text-center text-sm">{win.url}</span>

        <div className="flex shrink-0 items-center gap-0.5">
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              maximizeWindow(win.id);
            }}
            className="flex h-5.5 w-5.5 cursor-pointer items-center justify-center border-none bg-transparent text-[#aaa]"
          >
            <Maximize size={14} />
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              removeWindow(win.id);
            }}
            className="flex h-5.5 w-5.5 cursor-pointer items-center justify-center border-none bg-transparent text-[#aaa]"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="relative flex-1 bg-[#0f0f0f]">
        {win.url ? (
          <iframe src={win.url} className="h-full w-full border-0" />
        ) : (
          <div className="p-3 text-[#777]">Empty window</div>
        )}

        {/* RESIZE HANDLE */}
        <div
          onPointerDown={(e) => {
            e.stopPropagation();

            setActiveWindow(win.id);
            bringToFront(win.id);

            resizing.current = true;

            const startX = e.clientX;
            const startY = e.clientY;

            const baseW = win.w;
            const baseH = win.h;

            const el = e.currentTarget;
            el.setPointerCapture(e.pointerId);

            const minW = 200;
            const minH = 120;

            const onMove = (ev: PointerEvent) => {
              if (!resizing.current) return;

              const dx = ev.clientX - startX;
              const dy = ev.clientY - startY;

              updateWindow(win.id, {
                w: Math.max(minW, baseW + dx),
                h: Math.max(minH, baseH + dy),
              });
            };

            const onUp = () => {
              resizing.current = false;
              el.removeEventListener("pointermove", onMove);
              el.removeEventListener("pointerup", onUp);
            };

            el.addEventListener("pointermove", onMove);
            el.addEventListener("pointerup", onUp);
          }}
          className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 cursor-nwse-resize rounded-[3px] bg-white/20"
        />
      </div>
    </div>
  );
}
