import { createFileRoute, Outlet } from "@tanstack/react-router";
import { FC } from "react";

const RouteComponent: FC = () => <Outlet />;

export const Route = createFileRoute("/setup")({
	component: RouteComponent,
});
