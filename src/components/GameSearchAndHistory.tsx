import { FC, useState, useMemo } from "react";
import { GameState } from "../types";
import { decompress } from "../utils";
import { PanelLight } from "./Panels/PanelLight";

// Icons
const SearchIcon: FC = () => (
	<svg
		className="h-5 w-5"
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
		/>
	</svg>
);

interface SavedGame extends GameState {
	lastPlayed: string;
	totalGames: number;
}

const GameSearchAndHistory: FC = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [playerFilter, setPlayerFilter] = useState("");
	const [dateFilter, setDateFilter] = useState("all"); // all, today, week, month

	const savedGames = useMemo(() => {
		const games: SavedGame[] = [];
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key?.startsWith("game-")) {
				try {
					const data = localStorage.getItem(key);
					if (data) {
						const gameState: GameState = decompress(data);
						games.push({
							...gameState,
							lastPlayed: new Date(
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
		return games.sort(
			(a, b) =>
				new Date(b.meta.date).getTime() -
				new Date(a.meta.date).getTime(),
		);
	}, []);

	const filteredGames = useMemo(() => {
		return savedGames.filter((game) => {
			// Search term filter
			const matchesSearch =
				searchTerm === "" ||
				game.players.some((player) =>
					player.toLowerCase().includes(searchTerm.toLowerCase()),
				) ||
				game.meta.id.toLowerCase().includes(searchTerm.toLowerCase());

			// Player filter
			const matchesPlayer =
				playerFilter === "" ||
				game.players.some((player) =>
					player.toLowerCase().includes(playerFilter.toLowerCase()),
				);

			// Date filter
			const gameDate = new Date(game.meta.date);
			const now = new Date();
			let matchesDate = true;

			switch (dateFilter) {
				case "today": {
					matchesDate =
						gameDate.toDateString() === now.toDateString();
					break;
				}
				case "week": {
					const weekAgo = new Date(
						now.getTime() - 7 * 24 * 60 * 60 * 1000,
					);
					matchesDate = gameDate >= weekAgo;
					break;
				}
				case "month": {
					const monthAgo = new Date(
						now.getTime() - 30 * 24 * 60 * 60 * 1000,
					);
					matchesDate = gameDate >= monthAgo;
					break;
				}
				default:
					matchesDate = true;
			}

			return matchesSearch && matchesPlayer && matchesDate;
		});
	}, [savedGames, searchTerm, playerFilter, dateFilter]);

	return (
		<div className="space-y-6">
			{/* Search and Filter Controls */}
			<PanelLight>
				<h2 className="mb-4 text-xl font-bold text-white">
					Spēļu vēsture
				</h2>

				{/* Search Bar */}
				<div className="relative mb-4">
					<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<SearchIcon />
					</div>
					<input
						type="text"
						placeholder="Meklēt pēc spēlētāja vārda vai spēles ID..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="block w-full rounded-lg border border-white/30 bg-white/10 py-2 pr-3 pl-10 text-white placeholder-white/60 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
					/>
				</div>

				{/* Filter Controls */}
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<div>
						<label className="mb-1 block text-sm font-medium text-white/80">
							Spēlētājs
						</label>
						<input
							type="text"
							placeholder="Filtrēt pēc spēlētāja..."
							value={playerFilter}
							onChange={(e) => setPlayerFilter(e.target.value)}
							className="block w-full rounded-lg border border-white/30 bg-white/10 px-3 py-2 text-white placeholder-white/60 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
						/>
					</div>

					<div>
						<label className="mb-1 block text-sm font-medium text-white/80">
							Datums
						</label>
						<select
							value={dateFilter}
							onChange={(e) => setDateFilter(e.target.value)}
							className="block w-full rounded-lg border border-white/30 bg-white/10 px-3 py-2 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
						>
							<option value="all">Visas spēles</option>
							<option value="today">Šodien</option>
							<option value="week">Pēdējā nedēļa</option>
							<option value="month">Pēdējais mēnesis</option>
						</select>
					</div>

					<div className="flex items-end">
						<span className="text-sm text-white/80">
							Atrasti: {filteredGames.length} no{" "}
							{savedGames.length}
						</span>
					</div>
				</div>
			</PanelLight>

			{/* Games List */}
			<div className="space-y-3">
				{filteredGames.length === 0 ? (
					<div className="rounded-lg border border-white/20 bg-gradient-to-br from-white/20 to-white/10 p-6 text-center shadow-lg">
						<p className="text-white/60">
							Nav atrasta neviena spēle
						</p>
					</div>
				) : (
					filteredGames.map((game) => (
						<GameHistoryCard key={game.meta.id} game={game} />
					))
				)}
			</div>
		</div>
	);
};

const GameHistoryCard: FC<{ game: SavedGame }> = ({ game }) => {
	const [isExpanded, setIsExpanded] = useState(false);

	const handleContinueGame = () => {
		window.location.href = `#/game/${encodeURIComponent(localStorage.getItem(`game-${game.meta.id}`) || "")}`;
	};

	const handleDeleteGame = () => {
		if (confirm("Vai tiešām vēlaties dzēst šo spēli?")) {
			localStorage.removeItem(`game-${game.meta.id}`);
			window.location.reload();
		}
	};

	return (
		<PanelLight>
			<div className="mb-2 flex items-center justify-between">
				<div>
					<h3 className="text-lg font-semibold text-white">
						Spēle #{game.meta.id.slice(-8)}
					</h3>
					<p className="text-sm text-white/60">
						{game.lastPlayed} • {game.totalGames} spēles
					</p>
				</div>
				<div className="flex space-x-2">
					<button
						onClick={() => setIsExpanded(!isExpanded)}
						className="rounded-lg bg-emerald-600 px-3 py-1 text-sm text-white transition-colors hover:bg-emerald-700"
					>
						{isExpanded ? "Paslēpt" : "Skatīt"}
					</button>
					<button
						onClick={handleContinueGame}
						className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-700"
					>
						Turpināt
					</button>
					<button
						onClick={handleDeleteGame}
						className="rounded-lg bg-red-600 px-3 py-1 text-sm text-white transition-colors hover:bg-red-700"
					>
						Dzēst
					</button>
				</div>
			</div>

			<div className="mb-2 flex flex-wrap gap-2">
				{game.players.map((player, index) => (
					<span
						key={index}
						className="rounded-full bg-emerald-500/30 px-2 py-1 text-xs text-emerald-100"
					>
						{player}
					</span>
				))}
			</div>

			{isExpanded && (
				<div className="mt-4 space-y-2">
					<h4 className="font-medium text-white">
						Detalizēta informācija:
					</h4>
					<div className="grid grid-cols-2 gap-4 text-sm">
						<div>
							<span className="text-white/60">Spēles ID:</span>
							<span className="ml-2 text-white">
								{game.meta.id}
							</span>
						</div>
						<div>
							<span className="text-white/60">Izveidots:</span>
							<span className="ml-2 text-white">
								{new Date(game.meta.date).toLocaleString(
									"lv-LV",
								)}
							</span>
						</div>
						<div>
							<span className="text-white/60">
								Spēlētāju skaits:
							</span>
							<span className="ml-2 text-white">
								{game.players.length}
							</span>
						</div>
						<div>
							<span className="text-white/60">
								Pabeigtas spēles:
							</span>
							<span className="ml-2 text-white">
								{game.totalGames}
							</span>
						</div>
					</div>
				</div>
			)}
		</PanelLight>
	);
};

export default GameSearchAndHistory;
