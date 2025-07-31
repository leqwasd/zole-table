import { createFileRoute, Link } from "@tanstack/react-router";
import { FC } from "react";

const Index: FC = () => {
	return (
		// <SetupPage />
		<div className="p-2">
			<h3>Welcome Home!</h3>
			<Link to="/setup">New Game</Link>
		</div>
	);
};

export const Route = createFileRoute("/")({
	component: Index,
});
