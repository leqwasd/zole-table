import { createFileRoute, Link } from "@tanstack/react-router";
import { FC, ReactNode, useMemo } from "react";
import { decompress } from "../utils";
import { GameState } from "../types";

// Reusable Home Page Components
const HomePageLayout: FC<{ children: ReactNode }> = ({ children }) => (
	<div className="min-h-screen bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-4 flex items-center justify-center relative overflow-hidden">
		{/* Background decorative elements */}
		<div className="absolute inset-0 bg-gradient-to-t from-emerald-800/30 to-transparent"></div>
		<div className="absolute top-1/4 -right-32 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"></div>
		<div className="absolute bottom-1/4 -left-32 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl"></div>
		<div className="text-center relative z-10">{children}</div>
	</div>
);

const HomePrimaryButton: FC<{
	children: ReactNode;
	to: string;
	params?: Record<string, unknown>;
	variant?: "primary" | "secondary";
}> = ({ children, to, params, variant = "primary" }) => {
	const baseClasses =
		"inline-block py-4 px-8 rounded-lg font-semibold text-xl transition-all duration-300 shadow-lg hover:shadow-xl";
	const variantClasses =
		variant === "primary"
			? "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white"
			: "bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white border border-white/30";

	return (
		<Link
			to={to}
			params={params}
			className={`${baseClasses} ${variantClasses}`}
		>
			{children}
		</Link>
	);
};

const RecentGamesSection: FC = () => {
	const recentGames = useMemo(() => {
		const games: Array<{
			id: string;
			players: string[];
			date: string;
			totalGames: number;
		}> = [];
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key?.startsWith("game-")) {
				try {
					const data = localStorage.getItem(key);
					if (data) {
						const gameState: GameState = decompress(data);
						games.push({
							id: gameState.meta.id,
							players: gameState.players,
							date: new Date(
								gameState.meta.date,
							).toLocaleDateString("lv-LV"),
							totalGames: gameState.games?.length || 0,
						});
					}
				} catch (error) {
					console.warn(`Failed to parse saved game ${key}:`, error);
				}
			}
		}
		return games
			.sort(
				(a, b) =>
					new Date(b.date).getTime() - new Date(a.date).getTime(),
			)
			.slice(0, 3);
	}, []);

	if (recentGames.length === 0) {
		return null;
	}

	const clearAllGames = () => {
		if (confirm("Vai tiešām vēlaties dzēst visas saglabātās spēles?")) {
			const keysToRemove = [];
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i);
				if (key?.startsWith("game-")) {
					keysToRemove.push(key);
				}
			}
			keysToRemove.forEach((key) => localStorage.removeItem(key));
			window.location.reload();
		}
	};

	return (
		<div className="mt-8 p-6 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 max-w-lg mx-auto">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-semibold text-white">
					Pēdējās spēles
				</h3>
				<button
					onClick={clearAllGames}
					className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
				>
					Dzēst visas
				</button>
			</div>
			<div className="space-y-3">
				{recentGames.map((game) => (
					<div
						key={game.id}
						className="flex items-center justify-between bg-white/10 rounded-lg p-3"
					>
						<div>
							<div className="text-white font-medium">
								{game.players.join(", ")}
							</div>
							<div className="text-emerald-200 text-sm">
								{game.date} • {game.totalGames} spēles
							</div>
						</div>
						<button
							onClick={() => {
								const gameData = localStorage.getItem(
									`game-${game.id}`,
								);
								if (gameData) {
									window.location.href = `#/game/${encodeURIComponent(gameData)}`;
								}
							}}
							className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg transition-colors"
						>
							Turpināt
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

const Index: FC = () => {
	return (
		<HomePageLayout>
			<h1 className="text-4xl font-bold text-white mb-8 drop-shadow-lg">
				Zolītes punktu tabula
			</h1>

			<div className="space-y-4 mb-8">
				<HomePrimaryButton
					to="/setup/{-$data}"
					params={{ data: undefined }}
				>
					Jauna spēle
				</HomePrimaryButton>

				{/* <div className="flex gap-4 justify-center">
					<a
						href="https://github.com/leqwasd/zole-table"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-block bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white py-3 px-6 rounded-lg font-medium text-lg transition-all duration-300 shadow-lg hover:shadow-xl border border-white/30"
					>
						⭐ GitHub
					</a>
				</div> */}
			</div>
			{/* 
			<RecentGamesSection /> */}
		</HomePageLayout>
	);
};

export const Route = createFileRoute("/")({
	component: Index,
});
