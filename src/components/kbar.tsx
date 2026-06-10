import { Command } from "cmdk";
import { useEffect, useState } from "react";
import { useStore } from "../store/useStore";

const itemClass =
  "flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-[#eee] outline-none data-[selected=true]:bg-[#333]";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState<"root" | "windows">("root");
  const windows = useStore((s) => s.windows);
  const centerOnWindow = useStore((s) => s.centerOnWindow);
  const setActiveWindow = useStore((s) => s.setActiveWindow);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const goToWindow = (id: string) => {
    centerOnWindow(id);
    setActiveWindow(id);
    setOpen(false);
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && page !== "root") {
          setPage("root");
          return;
        }
        setOpen(isOpen);
        if (!isOpen) setPage("root");
      }}
      label="Global Command Menu"
      className="fixed top-[20%] left-1/2 z-99999 w-full max-w-lg -translate-x-1/2 rounded-2xl border border-white/10 bg-[#222] p-2 shadow-lg shadow-black/30 backdrop-blur-sm"
    >
      {page === "root" && (
        <>
          <Command.Input
            autoFocus
            placeholder="Type a command..."
            className="h-10 w-full rounded-xl bg-[#333] px-4 text-sm text-[#eee] placeholder-white/40 outline-none focus:ring-2 focus:ring-white/25"
          />
          <Command.List className="mt-2 max-h-64 overflow-y-auto">
            <Command.Empty className="px-3 py-2 text-sm text-white/40">
              No results found.
            </Command.Empty>

            <Command.Item
              onSelect={() => setPage("windows")}
              className={itemClass}
            >
              Search Windows
            </Command.Item>
          </Command.List>
        </>
      )}

      {page === "windows" && (
        <>
          <div className="flex items-center gap-2 px-2 pb-2">
            <button
              onClick={() => setPage("root")}
              className="text-xs text-white/40 hover:text-white/70"
            >
              ← Back
            </button>
            <span className="text-xs text-white/40">Open Windows</span>
          </div>
          <Command.Input
            autoFocus
            placeholder="Search windows..."
            className="h-10 w-full rounded-xl bg-[#333] px-4 text-sm text-[#eee] placeholder-white/40 outline-none focus:ring-2 focus:ring-white/25"
          />
          <Command.List className="mt-2 max-h-64 overflow-y-auto">
            <Command.Empty className="px-3 py-2 text-sm text-white/40">
              No windows found.
            </Command.Empty>

            {windows.map((w) => (
              <Command.Item
                key={w.id}
                value={w.id}
                onSelect={() => goToWindow(w.id)}
                className={itemClass}
              >
                {w.url}
              </Command.Item>
            ))}
          </Command.List>
        </>
      )}
    </Command.Dialog>
  );
}
