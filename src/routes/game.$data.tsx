import { createFileRoute } from "@tanstack/react-router";
import { FC } from "react";
import { decompress, compress } from "../utils";

const RouteComponent: FC = () => {
	const { data } = Route.useParams();
	const json = JSON.stringify(data);
	return (
		<div>
			<pre>{json}</pre>
		</div>
	);
};

type GameData = {
	players: string[];
	dealer: number;
};

export const Route = createFileRoute("/game/$data")({
	component: RouteComponent,
	params: {
		parse: (params) => ({
			data: decompress<GameData>(params.data),
		}),
		stringify: (params) => ({
			data: compress(params.data),
		}),
	},
});
