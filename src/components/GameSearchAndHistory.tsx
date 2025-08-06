import { FC, useState, useMemo } from "react";
import { GameState } from "../types";
import { decompress } from "../utils";

// Icons
const SearchIcon: FC = () => (
	<svg
		className="w-5 h-5"
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
			<div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-white/20">
				<h2 className="text-xl font-bold text-white mb-4">
					Spēļu vēsture
				</h2>

				{/* Search Bar */}
				<div className="relative mb-4">
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<SearchIcon />
					</div>
					<input
						type="text"
						placeholder="Meklēt pēc spēlētāja vārda vai spēles ID..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="block w-full pl-10 pr-3 py-2 border border-white/30 rounded-lg bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
					/>
				</div>

				{/* Filter Controls */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<label className="block text-sm font-medium text-white/80 mb-1">
							Spēlētājs
						</label>
						<input
							type="text"
							placeholder="Filtrēt pēc spēlētāja..."
							value={playerFilter}
							onChange={(e) => setPlayerFilter(e.target.value)}
							className="block w-full px-3 py-2 border border-white/30 rounded-lg bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-500"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-white/80 mb-1">
							Datums
						</label>
						<select
							value={dateFilter}
							onChange={(e) => setDateFilter(e.target.value)}
							className="block w-full px-3 py-2 border border-white/30 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
						>
							<option value="all">Visas spēles</option>
							<option value="today">Šodien</option>
							<option value="week">Pēdējā nedēļa</option>
							<option value="month">Pēdējais mēnesis</option>
						</select>
					</div>

					<div className="flex items-end">
						<span className="text-white/80 text-sm">
							Atrasti: {filteredGames.length} no{" "}
							{savedGames.length}
						</span>
					</div>
				</div>
			</div>

			{/* Games List */}
			<div className="space-y-3">
				{filteredGames.length === 0 ? (
					<div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-lg p-6 text-center shadow-lg border border-white/20">
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
		<div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-white/20">
			<div className="flex items-center justify-between mb-2">
				<div>
					<h3 className="text-lg font-semibold text-white">
						Spēle #{game.meta.id.slice(-8)}
					</h3>
					<p className="text-white/60 text-sm">
						{game.lastPlayed} • {game.totalGames} spēles
					</p>
				</div>
				<div className="flex space-x-2">
					<button
						onClick={() => setIsExpanded(!isExpanded)}
						className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg transition-colors"
					>
						{isExpanded ? "Paslēpt" : "Skatīt"}
					</button>
					<button
						onClick={handleContinueGame}
						className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
					>
						Turpināt
					</button>
					<button
						onClick={handleDeleteGame}
						className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
					>
						Dzēst
					</button>
				</div>
			</div>

			<div className="flex flex-wrap gap-2 mb-2">
				{game.players.map((player, index) => (
					<span
						key={index}
						className="px-2 py-1 bg-emerald-500/30 text-emerald-100 text-xs rounded-full"
					>
						{player}
					</span>
				))}
			</div>

			{isExpanded && (
				<div className="mt-4 space-y-2">
					<h4 className="text-white font-medium">
						Detalizēta informācija:
					</h4>
					<div className="grid grid-cols-2 gap-4 text-sm">
						<div>
							<span className="text-white/60">Spēles ID:</span>
							<span className="text-white ml-2">
								{game.meta.id}
							</span>
						</div>
						<div>
							<span className="text-white/60">Izveidots:</span>
							<span className="text-white ml-2">
								{new Date(game.meta.date).toLocaleString(
									"lv-LV",
								)}
							</span>
						</div>
						<div>
							<span className="text-white/60">
								Spēlētāju skaits:
							</span>
							<span className="text-white ml-2">
								{game.players.length}
							</span>
						</div>
						<div>
							<span className="text-white/60">
								Pabeigtas spēles:
							</span>
							<span className="text-white ml-2">
								{game.totalGames}
							</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default GameSearchAndHistory;
