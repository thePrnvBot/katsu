# Katsu

A spatial browser workspace. Open URLs on a 10x10 grid of viewport-sized cells and navigate between them via arrow keys.

<img width="2557" height="1271" alt="image" src="https://github.com/user-attachments/assets/f4401db0-3ba8-454f-981b-e557b6483ad7" />

## Tech Stack

- React 19, TypeScript 6, Vite 8
- TanStack Router, Zustand, Tailwind CSS 4
- cmdk (command palette), react-rnd (draggable/resizable windows)
- Lucide React (icons), Geist (font), tailwind-merge

## Getting Started

```sh
bun install
bun dev
```

## Usage

- **Open a URL** -- type in the input bar and press Enter or click Open
- **Navigate grid** -- scroll wheel or arrow keys to move between cells (clamped to 10x10 for now)
- **Command palette** -- Ctrl+K / Cmd+K to search windows or apply layout presets
- **Window layouts** -- snap active window to halves, thirds, or quarters of the current cell via command palette
- **Minimap** -- bottom-right corner shows grid position; click to jump
- **Windows** -- drag title bar to move, bottom-right handle to resize; click to bring to front
- **Maximize** -- fills the current cell; click again to restore
- **Double-click** title bar to center camera on a window
- **Close** -- X button on title bar to remove a window

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start dev server |
| `bun build` | Type-check (`tsc -b`) and build |
| `bun lint` | Run ESLint |
| `bun preview` | Preview production build |
