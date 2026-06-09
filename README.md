# Katsu

A spatial browser workspace. Open URLs on a grid of viewport-sized workspaces and navigate between them via arrow keys.

<img width="2557" height="1271" alt="image" src="https://github.com/user-attachments/assets/f4401db0-3ba8-454f-981b-e557b6483ad7" />

## Tech Stack

- React 19, TypeScript, Vite
- Zustand (state), Tailwind CSS 4, Lucide React (icons), Geist (font)

## Getting Started

```sh
bun install
bun dev
```

## Usage

- **Open a URL** -- type in the input bar and press Enter or click Open
- **Navigate grid** -- scroll wheel or arrow keys move between cells
- **Minimap** -- bottom-right corner shows grid position; click to jump
- **Windows** -- drag title bar to move, bottom-right handle to resize
- **Maximize** -- fills the current cell; click again to restore
- **Double-click** title bar to center on a window

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start dev server |
| `bun build` | Type-check and build |
| `bun lint` | Run ESLint |
