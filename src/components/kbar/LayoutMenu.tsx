import { Command } from "cmdk";
import { useStore } from "../../store/useStore";
import type { WindowLayout } from "../../utils/windowLayouts";
import type { SubMenuProps } from "./CommandMenu";

export function LayoutMenu({ closeAndResetMenu }: SubMenuProps) {
  const activeWindowId = useStore((s) => s.activeWindowId);
  const setWindowLayout = useStore((s) => s.setWindowLayout);

  type LayoutItem = {
    key: WindowLayout;
    label: string;
  };

  const LAYOUTS: LayoutItem[] = [
    { key: "left_half", label: "Left Half" },
    { key: "right_half", label: "Right Half" },
    { key: "left_third", label: "Left One Third" },
    { key: "center_third", label: "Center One Third" },
    { key: "right_third", label: "Right One Third" },
    { key: "top_left_quarter", label: "Top Left Quarter" },
    { key: "top_right_quarter", label: "Top Right Quarter" },
    { key: "bottom_left_quarter", label: "Bottom Left Quarter" },
    { key: "bottom_right_quarter", label: "Bottom Right Quarter" },
  ];

  const applyWindowLayout = (layout: WindowLayout) => {
    if (!activeWindowId) {
      closeAndResetMenu();
      return;
    }

    setWindowLayout(activeWindowId, layout);
    closeAndResetMenu();
  };

  return (
    <>
      {LAYOUTS.map(({ key, label }) => (
        <Command.Item
          key={key}
          onSelect={() => applyWindowLayout(key)}
          className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-[#eee] outline-none data-[selected=true]:bg-[#333]"
        >
          {label}
        </Command.Item>
      ))}
    </>
  );
}
