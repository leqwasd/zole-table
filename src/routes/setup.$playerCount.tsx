import { createFileRoute, Outlet } from "@tanstack/react-router";
import { FC } from "react";

const RouteComponent: FC = () => {
	return <Outlet />;
};

export const Route = createFileRoute("/setup/$playerCount")({
	component: RouteComponent,
	parseParams: (params) => ({
		playerCount: +params.playerCount,
	}),
	beforeLoad: ({ params }) => {
		const count = params.playerCount;
		if (isNaN(count) || count < 3 || count > 4) {
			throw new Error("Invalid player count. Must be 3 or 4.");
		}
	},
});
