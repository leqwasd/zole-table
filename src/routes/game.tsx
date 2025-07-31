import { createFileRoute } from "@tanstack/react-router";
import { FC } from "react";

const Game: FC = () => {
	return <div className="p-2">Hello from About!</div>;
};

export const Route = createFileRoute("/game")({
	component: Game,
});
