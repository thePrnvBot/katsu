import { Command } from "cmdk";
import type { SubMenuProps } from "./CommandMenu";

export function RootMenu({ navigateToPage }: SubMenuProps) {
  return (
    <>
      <Command.Empty className="px-3 py-2 text-sm text-white/40">
        No results found.
      </Command.Empty>
      <Command.Item
        onSelect={() => navigateToPage("windows")}
        className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-[#eee] outline-none data-[selected=true]:bg-[#333]"
      >
        Search Windows
      </Command.Item>
      <Command.Item
        onSelect={() => navigateToPage("layout")}
        className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-[#eee] outline-none data-[selected=true]:bg-[#333]"
      >
        Set Window Layout
      </Command.Item>
    </>
  );
}
