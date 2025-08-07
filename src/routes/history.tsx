import { createFileRoute } from "@tanstack/react-router";
import { FC } from "react";
import GameSearchAndHistory from "../components/GameSearchAndHistory";

const HistoryPageLayout: FC<{ children: React.ReactNode }> = ({ children }) => (
	<div className="min-h-screen bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-4">
		{/* Background decorative elements */}
		<div className="absolute inset-0 bg-gradient-to-t from-emerald-800/20 to-transparent"></div>
		<div className="absolute top-1/3 right-0 h-72 w-72 rounded-full bg-emerald-400/15 blur-2xl"></div>
		<div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-teal-400/15 blur-2xl"></div>

		<div className="relative z-10 mx-auto max-w-6xl">{children}</div>
	</div>
);

const HistoryPage: FC = () => {
	return (
		<HistoryPageLayout>
			<div className="mb-6">
				<div className="mb-4 flex items-center justify-between">
					<h1 className="text-3xl font-bold text-white drop-shadow-lg">
						Spēļu vēsture
					</h1>
					<a
						href="#/"
						className="rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-2 font-medium text-white shadow-lg transition-all duration-300 hover:from-emerald-700 hover:to-emerald-800 hover:shadow-xl"
					>
						← Atpakaļ
					</a>
				</div>
				<p className="text-lg text-emerald-100">
					Aplūko un pārvaldi savas iepriekšējās spēles
				</p>
			</div>
			<GameSearchAndHistory />
		</HistoryPageLayout>
	);
};

export const Route = createFileRoute("/history")({
	component: HistoryPage,
});
