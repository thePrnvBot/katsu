import { Command } from "cmdk";
import type { SubMenuProps } from "./CommandMenu";
import { useStore } from "../../store/useStore";

export function WindowsMenu({ closeAndResetMenu }: SubMenuProps) {
  const windows = useStore((s) => s.windows);
  const centerOnWindow = useStore((s) => s.centerOnWindow);
  const setActiveWindow = useStore((s) => s.setActiveWindow);

  const goToWindow = (id: string) => {
    centerOnWindow(id);
    setActiveWindow(id);
    closeAndResetMenu();
  };

  return (
    <>
      <Command.Empty className="px-3 py-2 text-sm text-white/40">
        No windows found.
      </Command.Empty>
      {windows.map((w) => (
        <Command.Item
          key={w.id}
          value={`${w.url} ${w.id}`}
          onSelect={() => goToWindow(w.id)}
          className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-[#eee] outline-none data-[selected=true]:bg-[#333]"
        >
          {w.url}
        </Command.Item>
      ))}
    </>
  );
}
