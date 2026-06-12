import { Command } from "cmdk";
import { useEffect, useState } from "react";
import { RootMenu } from "./RootMenu";
import { WindowsMenu } from "./WindowsMenu";

type CommandPages = "root" | "windows";

export interface SubMenuProps {
  navigateToPage: (page: CommandPages) => void;
  closeMenu: () => void;
}

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [pages, setPages] = useState<CommandPages[]>(["root"]);
  const page = pages[pages.length - 1];

  /** Navigate command menu to page*/
  const navigateToPage = (p: CommandPages) => {
    setSearch("");
    setPages((s) => [...s, p]);
  };

  /** Navigate command menu to previous page*/
  const goBackToPreviousPage = () => {
    setPages((pages) => (pages.length > 1 ? pages.slice(0, -1) : pages));
  };

  /* Open command menu on Ctrl+K or meta+K */
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

  /** Close command menu dialog */
  const closeMenu = () => {
    setOpen(false);
  };

  /** Reset command menu search and set page to root */
  const resetMenu = () => {
    setSearch("");
    setPages(["root"]);
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetMenu();
      }}
      label="Global Command Menu"
      className="fixed top-[20%] left-1/2 z-99999 w-full max-w-lg -translate-x-1/2 rounded-2xl border border-white/10 bg-[#222] p-2 shadow-lg shadow-black/30 backdrop-blur-sm"
      onKeyDown={(e) => {
        // Escape goes to previous page
        // Backspace goes to previous page when search is empty
        if (e.key === "Escape" || (e.key === "Backspace" && !search)) {
          e.preventDefault();
          goBackToPreviousPage();
        }
      }}
    >
      {page !== "root" && (
        <div className="flex items-center gap-2 px-2 pb-2">
          <button
            onClick={goBackToPreviousPage}
            className="text-xs text-white/40 hover:text-white/70"
          >
            ← Back
          </button>
        </div>
      )}
      <Command.Input
        autoFocus
        value={search}
        onValueChange={setSearch}
        placeholder="Search..."
        className="h-10 w-full rounded-xl bg-[#333] px-4 text-sm text-[#eee] placeholder-white/40 outline-none"
      />
      <Command.List className="mt-2 max-h-64 overflow-y-auto">
        {page === "root" && (
          <RootMenu navigateToPage={navigateToPage} closeMenu={closeMenu} />
        )}
        {page === "windows" && (
          <WindowsMenu navigateToPage={navigateToPage} closeMenu={closeMenu} />
        )}
      </Command.List>
    </Command.Dialog>
  );
}
