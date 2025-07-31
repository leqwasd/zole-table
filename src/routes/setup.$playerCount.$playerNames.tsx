import { createFileRoute, Link } from "@tanstack/react-router";
import { FC, useMemo } from "react";
import { FlexLayout } from "../Pages/Components/FlexLayout";

const RouteComponent: FC = () => {
	const { playerNames } = Route.useParams(); // Now typed as number

	// Generate placeholders based on player count
	const placeholders = useMemo(
		() => JSON.parse(playerNames) as string[],
		[playerNames],
	);

	return (
		<FlexLayout>
			{placeholders.map((name, dealer) => (
				<Link
					key={dealer}
					className="flex-1 p-10 text-3xl"
					from={Route.fullPath}
					to="$dealer"
					params={{ dealer }}
				>
					{name}
				</Link>
			))}
		</FlexLayout>
	);
};

export const Route = createFileRoute("/setup/$playerCount/$playerNames")({
	component: RouteComponent,
});
