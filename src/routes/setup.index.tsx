import { createFileRoute, Link } from "@tanstack/react-router";
import { FlexLayout } from "../Pages/Components/FlexLayout";
import { FC } from "react";

const RouteComponent: FC = () => {
	return (
		<FlexLayout>
			<Link
				className="flex-1 p-10 text-3xl"
				from={Route.fullPath}
				to="$playerCount"
				params={{ playerCount: 3 }}
			>
				3
			</Link>
			<Link
				className="flex-1 p-10 text-3xl"
				from={Route.fullPath}
				to="$playerCount"
				params={{ playerCount: 4 }}
			>
				4
			</Link>
		</FlexLayout>
	);
};

export const Route = createFileRoute("/setup/")({
	component: RouteComponent,
});
