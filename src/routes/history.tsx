import { createFileRoute } from "@tanstack/react-router";
import { FC } from "react";
import GameSearchAndHistory from "../components/GameSearchAndHistory";

const HistoryPageLayout: FC<{ children: React.ReactNode }> = ({ children }) => (
	<div className="min-h-screen bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-4">
		{/* Background decorative elements */}
		<div className="absolute inset-0 bg-gradient-to-t from-emerald-800/20 to-transparent"></div>
		<div className="absolute top-1/3 right-0 w-72 h-72 bg-emerald-400/15 rounded-full blur-2xl"></div>
		<div className="absolute bottom-0 left-1/4 w-64 h-64 bg-teal-400/15 rounded-full blur-2xl"></div>

		<div className="max-w-6xl mx-auto relative z-10">{children}</div>
	</div>
);

const HistoryPage: FC = () => {
	return (
		<HistoryPageLayout>
			<div className="mb-6">
				<div className="flex items-center justify-between mb-4">
					<h1 className="text-3xl font-bold text-white drop-shadow-lg">
						Spēļu vēsture
					</h1>
					<a
						href="#/"
						className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
					>
						← Atpakaļ
					</a>
				</div>
				<p className="text-emerald-100 text-lg">
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
