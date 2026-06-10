import { Outlet, createRootRoute } from "@tanstack/react-router";
import { CameraAnimator } from "../components/cameraAnimator";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="fixed inset-0 overflow-hidden">
      <CameraAnimator />
      <Outlet />
    </div>
  );
}
