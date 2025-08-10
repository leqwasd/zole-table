import { createFileRoute } from "@tanstack/react-router";
import { FC } from "react";
import GameSearchAndHistory from "../components/GameSearchAndHistory";

const HistoryPage: FC = () => {
	return (
		<>
			<div className="mb-6">
				<div className="mb-4 flex items-center justify-between">
					<h1 className="text-3xl font-bold text-white drop-shadow-lg">
						Spēļu vēsture
					</h1>
				</div>
				<p className="text-lg text-emerald-100">
					Aplūko un pārvaldi savas iepriekšējās spēles
				</p>
			</div>
			<GameSearchAndHistory />
		</>
	);
};

export const Route = createFileRoute("/history")({
	component: HistoryPage,
});
