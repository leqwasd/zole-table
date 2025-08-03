import { createFileRoute } from "@tanstack/react-router";
import { createContext, FC, useCallback, useContext, useMemo } from "react";
import { decompress, compress } from "../utils";
import {
	Game,
	GameState,
	GameStateAction,
	GameType,
	GameTypeEnum,
	GameTypeGaldins,
	GameTypeLielais,
	GameTypeMazaZole,
	GameTypeZole,
	GameWithScore,
	ZoleLoseResult,
	ZoleWinResult,
} from "../types";
import { FlexLayout } from "../Pages/Components/FlexLayout";

// Button Components
const ActionButton: FC<{
	onClick: () => void;
	variant: "red" | "purple" | "green";
	children: React.ReactNode;
}> = ({ onClick, variant, children }) => {
	const variantClasses = {
		red: "hover:bg-red-500/30 text-red-100 border-red-400 hover:border-red-300",
		purple: "hover:bg-purple-500/30 text-purple-100 border-purple-400 hover:border-purple-300",
		green: "hover:bg-green-500/30 text-green-100 border-green-400 hover:border-green-300",
	};

	return (
		<button
			type="button"
			className={`bg-transparent hover:text-white py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg border-2 ${variantClasses[variant]}`}
			onClick={onClick}
		>
			{children}
		</button>
	);
};

const ResultButton: FC<{
	onClick: () => void;
	variant: "win" | "lose";
	children: React.ReactNode;
	className?: string;
}> = ({ onClick, variant, children, className = "" }) => {
	const variantClasses = {
		win: "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800",
		lose: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800",
	};

	return (
		<button
			type="button"
			className={`${variantClasses[variant]} text-white py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg ${className}`}
			onClick={onClick}
		>
			{children}
		</button>
	);
};

// Game Type Display Component
const GameTypeDisplay: FC<{
	gameType: GameTypeEnum;
	size?: "sm" | "md";
	showBackground?: boolean;
}> = ({ gameType, size = "sm", showBackground = false }) => {
	const getColorClass = () => {
		switch (gameType) {
			case GameTypeEnum.Galdins:
				return "text-red-400";
			case GameTypeEnum.MazaZole:
				return "text-red-400";
			case GameTypeEnum.Zole:
				return "text-green-400";
			case GameTypeEnum.Lielais:
				return "text-purple-400";
			default:
				return "text-white";
		}
	};

	const getGameTypeName = () => {
		switch (gameType) {
			case GameTypeEnum.Galdins:
				return "Galdiņš";
			case GameTypeEnum.MazaZole:
				return "Mazā zole";
			case GameTypeEnum.Zole:
				return "Zole";
			case GameTypeEnum.Lielais:
				return "Lielais";
			default:
				return "";
		}
	};

	const sizeClasses = size === "md" ? "font-medium" : "";
	const backgroundClasses = showBackground
		? "text-emerald-200 font-medium mb-2"
		: "";

	if (showBackground) {
		return (
			<div className={backgroundClasses}>
				<span className={getColorClass()}>{getGameTypeName()}</span>
			</div>
		);
	}

	return (
		<span className={`${getColorClass()} ${sizeClasses}`}>
			{getGameTypeName()}
		</span>
	);
};

const GameContext = createContext({} as GameContext);
type GameContext = {
	state: Required<GameState>;
	gamesWithScore: GameWithScore[];
	setGamestateAction(action: GameStateAction): void;
	gameResultZaudejaGaldinu(gameType: GameTypeGaldins, player: number): void;
	gameResultMazaZole(gameType: GameTypeMazaZole, result: boolean): void;
	gameResultLielais(
		gameType: GameTypeZole | GameTypeLielais,
		result: ZoleWinResult | ZoleLoseResult,
	): void;
};
function useGameStateInContext(): Required<GameState> {
	const { data } = Route.useParams();
	return useMemo(
		() => ({
			games: data.games ?? [],
			preGameActions: data.preGameActions ?? [],
			gameType: data.gameType ?? null,
			players: data.players,
			dealer: data.dealer,
		}),
		[data],
	);
}
function useGameContext(): GameContext {
	return useContext(GameContext);
}
function useNavigateGame() {
	const navigate = Route.useNavigate();
	return useCallback(
		(data: GameState) => {
			navigate({
				to: "/game/$data",
				params: {
					data,
				},
			});
		},
		[navigate],
	);
}
const RouteComponent: FC = () => {
	const state = useGameStateInContext();
	const gamesWithScore = useMemo(() => {
		const results: GameWithScore[] = [];
		let previousScores = new Array(state.players.length).fill(0);
		for (const game of state.games) {
			results.push(withScore(game, previousScores, state.players));
			previousScores = results[results.length - 1].scores;
		}
		return results;
	}, [state]);
	const navigate = useNavigateGame();
	const setGamestateAction = useCallback(
		(action: GameStateAction) => {
			if (action === -1) {
				if (state.preGameActions.length === 2) {
					return navigate({
						...state,
						gameType: [GameTypeEnum.Galdins],
					});
				} else {
					return navigate({
						...state,
						preGameActions: state.preGameActions.concat(action),
					});
				}
			}
			const currentDealer =
				(state.dealer + state.games.length) % state.players.length;
			return navigate({
				...state,
				gameType: [
					action,
					(currentDealer + state.preGameActions.length + 1) %
						state.players.length,
				],
			});
		},
		[navigate, state],
	);
	const gameResultZaudejaGaldinu = useCallback(
		(gameType: GameTypeGaldins, player: number) => {
			const game: Game = [...gameType, player];
			return navigate({
				...state,
				games: [...state.games, game],
				gameType: null,
				preGameActions: [],
			});
		},
		[navigate, state],
	);
	const gameResultMazaZole = useCallback(
		(gameType: GameTypeMazaZole, result: boolean) => {
			const game: Game = [...gameType, +result];
			return navigate({
				...state,
				games: [...state.games, game],
				gameType: null,
				preGameActions: [],
			});
		},
		[navigate, state],
	);
	const gameResultLielais = useCallback(
		(
			gameType: GameTypeZole | GameTypeLielais,
			result: ZoleWinResult | ZoleLoseResult,
		) => {
			const game: Game = [...gameType, result];
			return navigate({
				...state,
				games: [...state.games, game],
				gameType: null,
				preGameActions: [],
			});
		},
		[navigate, state],
	);
	return (
		<GameContext.Provider
			value={{
				state,
				gamesWithScore,
				setGamestateAction,
				gameResultZaudejaGaldinu,
				gameResultMazaZole,
				gameResultLielais,
			}}
		>
			<GamePage />
		</GameContext.Provider>
	);
};
function withScore(
	game: Game,
	previousScores: number[],
	players: string[],
): GameWithScore {
	const diff = players.map((_, i) =>
		getPointsForGameForPlayer(game, i, players.length),
	);
	const scores = previousScores.map((score, i) => score + diff[i]);
	return {
		game,
		diff,
		scores,
	};
}
function getPointsForGameForPlayer(
	game: Game,
	player: number,
	playerCount: number,
) {
	const modifier = playerCount - 1;
	switch (game[0]) {
		case GameTypeEnum.Galdins:
			if (game[1] == player) {
				return PointTable.GaldinsLosePerPlayer * modifier;
			} else {
				return -PointTable.GaldinsLosePerPlayer;
			}
		case GameTypeEnum.MazaZole:
			if (game[2]) {
				if (game[1] === player) {
					return PointTable.MazaZoleWinPerPlayer * modifier;
				} else {
					return -PointTable.MazaZoleWinPerPlayer;
				}
			} else {
				if (game[1] === player) {
					return PointTable.MazaZoleLossPerPlayer * modifier;
				} else {
					return -PointTable.MazaZoleLossPerPlayer;
				}
			}
		case GameTypeEnum.Lielais:
			switch (game[2]) {
				case ZoleWinResult.win61:
					return player === game[1]
						? PointTable.LielaisWin * modifier
						: -PointTable.LielaisWin;
				case ZoleWinResult.win91:
					return player === game[1]
						? PointTable.LielaisWinJanos * modifier
						: -PointTable.LielaisWinJanos;
				case ZoleWinResult.winAll:
					return player === game[1]
						? PointTable.LielaisWinBezstiki * modifier
						: -PointTable.LielaisWinBezstiki;
				case ZoleLoseResult.lost60:
					return player === game[1]
						? PointTable.LielaisLost * modifier
						: -PointTable.LielaisLost;
				case ZoleLoseResult.lost30:
					return player === game[1]
						? PointTable.LielaisLostJanos * modifier
						: -PointTable.LielaisLostJanos;
				case ZoleLoseResult.lostAll:
					return player === game[1]
						? PointTable.LielaisLostBezstiki * modifier
						: -PointTable.LielaisLostBezstiki;
				default:
					return 0;
			}
		case GameTypeEnum.Zole:
			switch (game[2]) {
				case ZoleWinResult.win61:
					return player === game[1]
						? PointTable.ZoleWin * modifier
						: -PointTable.ZoleWin;
				case ZoleWinResult.win91:
					return player === game[1]
						? PointTable.ZoleWinJanos * modifier
						: -PointTable.ZoleWinJanos;
				case ZoleWinResult.winAll:
					return player === game[1]
						? PointTable.ZoleWinBezstiki * modifier
						: -PointTable.ZoleWinBezstiki;
				case ZoleLoseResult.lost60:
					return player === game[1]
						? PointTable.ZoleLost * modifier
						: -PointTable.ZoleLost;
				case ZoleLoseResult.lost30:
					return player === game[1]
						? PointTable.ZoleLostJanos * modifier
						: -PointTable.ZoleLostJanos;
				case ZoleLoseResult.lostAll:
					return player === game[1]
						? PointTable.ZoleLostBezstiki * modifier
						: -PointTable.ZoleLostBezstiki;
				default:
					return 0;
			}
	}
}
const PointTable = {
	GaldinsLosePerPlayer: -2,
	MazaZoleWinPerPlayer: 6,
	MazaZoleLossPerPlayer: -7,
	LielaisWin: 1,
	LielaisWinJanos: 2,
	LielaisWinBezstiki: 3,
	LielaisLost: -2,
	LielaisLostJanos: -3,
	LielaisLostBezstiki: -4,
	ZoleWin: 5,
	ZoleWinJanos: 6,
	ZoleWinBezstiki: 7,
	ZoleLost: -6,
	ZoleLostJanos: -7,
	ZoleLostBezstiki: -8,
};
export const PlayedGames: FC<{ games: GameWithScore[]; players: string[] }> = ({
	games,
	players,
}) => {
	const totals = useMemo(
		() =>
			games.length === 0
				? new Array(players.length).fill(0)
				: games[games.length - 1].scores,
		[games, players.length],
	);
	return (
		<div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-lg p-4 mb-4 shadow-lg border border-white/20">
			<table className="w-full text-white">
				<thead>
					<tr className="border-b border-emerald-400/30">
						<td className="pb-2 text-sm text-emerald-200">#</td>
						{players.map((name, i) => (
							<th
								key={i}
								className="pb-2 text-center font-semibold text-emerald-100"
							>
								{name}
							</th>
						))}
						<td className="pb-2" />
					</tr>
				</thead>
				<tbody>
					{games.map((game, i) => (
						<tr
							key={i}
							className={
								i % players.length === players.length - 1
									? "border-b border-emerald-400/20"
									: ""
							}
						>
							<td className="py-1 text-sm text-emerald-300">
								{i + 1}
							</td>
							{players.map((_, j) => (
								<GameCell key={j} player={j} game={game} />
							))}
							<td className="py-1 text-center text-emerald-200 text-sm">
								<GameTypeDisplay
									gameType={game.game[0]}
									size="sm"
								/>
							</td>
						</tr>
					))}
				</tbody>
				<tfoot>
					<tr className="border-t border-emerald-400/30">
						<td className="pt-2 font-bold text-emerald-100">Σ</td>
						{totals.map((total, i) => (
							<th
								key={i}
								className="pt-2 text-center font-bold text-emerald-100 text-lg"
							>
								{total}
							</th>
						))}
						<td className="pt-2" />
					</tr>
				</tfoot>
			</table>
		</div>
	);
};

function useGameResultClassName(
	player: number,
	gameWithScore: GameWithScore,
): string {
	const { game } = gameWithScore;
	if (
		(game[0] === GameTypeEnum.Lielais || game[0] === GameTypeEnum.Zole) &&
		game[1] === player
	) {
		if (
			game[2] === ZoleWinResult.win61 ||
			game[2] === ZoleWinResult.win91 ||
			game[2] === ZoleWinResult.winAll
		) {
			return "bg-green-500/30 border border-green-400/50";
		} else {
			return "bg-red-500/30 border border-red-400/50";
		}
	} else if (game[0] === GameTypeEnum.MazaZole && game[1] === player) {
		if (game[2]) {
			return "bg-green-500/30 border border-green-400/50";
		} else {
			return "bg-red-500/30 border border-red-400/50";
		}
	} else if (game[0] === GameTypeEnum.Galdins && game[1] === player) {
		return "bg-red-500/30 border border-red-400/50";
	}

	return "";
}
const GameCell: FC<{ player: number; game: GameWithScore }> = ({
	player,
	game,
}) => {
	const gameResultClassName = useGameResultClassName(player, game);
	return (
		<td className={"text-center py-1 " + gameResultClassName}>
			<span className="font-semibold text-white">
				{game.scores[player]}
			</span>{" "}
			<Diff diff={game.diff[player]} />
		</td>
	);
};

const Diff: FC<{ diff: number }> = ({ diff }) => (
	<span className="text-xs text-emerald-200 font-light">
		({diff > 0 && "+"}
		{diff})
	</span>
);

const GamePage: FC = () => {
	const { state, gamesWithScore } = useGameContext();
	const currentDealer =
		(state.dealer + state.games.length) % state.players.length;
	return (
		<div className="min-h-screen bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-4 relative overflow-hidden">
			{/* Background decorative elements */}
			<div className="absolute inset-0 bg-gradient-to-t from-emerald-800/20 to-transparent"></div>
			<div className="absolute top-1/4 -right-40 w-80 h-80 bg-emerald-400/8 rounded-full blur-3xl"></div>
			<div className="absolute bottom-1/3 -left-40 w-96 h-96 bg-teal-400/8 rounded-full blur-3xl"></div>
			<div className="absolute top-2/3 right-1/4 w-64 h-64 bg-emerald-300/6 rounded-full blur-2xl"></div>

			<div className="max-w-6xl mx-auto relative z-10">
				<h1 className="text-2xl font-bold text-white mb-4 text-center drop-shadow-lg">
					Zole Calculator
				</h1>
				<PlayedGames games={gamesWithScore} players={state.players} />
				<FlexLayout className="gap-3 mb-4">
					{state.players.map((player, index) => (
						<CurrentGamePlayer
							key={index}
							player={player}
							index={index}
							dealer={currentDealer}
							playerCount={state.players.length}
							preGameActions={state.preGameActions}
							gameType={state.gameType}
						/>
					))}
				</FlexLayout>
				{state.gameType != null && (
					<GameResults gameType={state.gameType} />
				)}
			</div>
		</div>
	);
};
const GameResults: FC<{ gameType: GameType }> = ({ gameType }) => {
	const { gameResultLielais } = useGameContext();
	if (
		gameType[0] === GameTypeEnum.Galdins ||
		gameType[0] === GameTypeEnum.MazaZole
	) {
		return null;
	}

	return (
		<div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-white/20">
			<h3 className="text-lg font-semibold text-white mb-3 text-center">
				Spēles rezultāts
			</h3>
			<div className="flex gap-3">
				<div className="flex-1 flex flex-col gap-2">
					<h4 className="text-emerald-200 font-medium text-sm text-center mb-1">
						Uzvarējis
					</h4>
					<ResultButton
						variant="win"
						onClick={() =>
							gameResultLielais(gameType, ZoleWinResult.win61)
						}
					>
						61 - 90 acīs
					</ResultButton>
					<ResultButton
						variant="win"
						onClick={() =>
							gameResultLielais(gameType, ZoleWinResult.win91)
						}
					>
						91+ acīs
					</ResultButton>
					<ResultButton
						variant="win"
						onClick={() =>
							gameResultLielais(gameType, ZoleWinResult.winAll)
						}
					>
						Visi stiķi
					</ResultButton>
				</div>
				<div className="flex-1 flex flex-col gap-2">
					<h4 className="text-emerald-200 font-medium text-sm text-center mb-1">
						Zaudējis
					</h4>
					<ResultButton
						variant="lose"
						onClick={() =>
							gameResultLielais(gameType, ZoleLoseResult.lost30)
						}
					>
						≤30 acīs
					</ResultButton>
					<ResultButton
						variant="lose"
						onClick={() =>
							gameResultLielais(gameType, ZoleLoseResult.lost60)
						}
					>
						31 - 60 acīs
					</ResultButton>
					<ResultButton
						variant="lose"
						onClick={() =>
							gameResultLielais(gameType, ZoleLoseResult.lostAll)
						}
					>
						0 stiķi
					</ResultButton>
				</div>
			</div>
		</div>
	);
};

const CurrentGamePlayer: FC<{
	player: string;
	index: number;
	dealer: number;
	playerCount: number;
	preGameActions: GameStateAction[];
	gameType: GameType | null;
}> = ({ player, index, dealer, playerCount, preGameActions, gameType }) => {
	const currentActionCount = preGameActions.length;
	const shouldGiveAction =
		gameType == null &&
		(dealer + currentActionCount + 1) % playerCount === index;

	return (
		<div className="flex-1 flex flex-col items-center bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-lg p-4 min-h-[200px] shadow-lg border border-white/20">
			<div className="text-white font-semibold text-lg mb-2">
				{player}
			</div>
			<Roka dealer={dealer} playerCount={playerCount} index={index} />

			{shouldGiveAction && <Actions />}

			{gameType != null && (
				<GameTypeInfo gameType={gameType} index={index} />
			)}
		</div>
	);
};

const Roka: FC<{ dealer: number; playerCount: number; index: number }> = ({
	dealer,
	playerCount,
	index,
}) => {
	let text: string | null = dealer === index ? "(Dalītājs) " : "";
	if ((dealer + 1) % playerCount === index) {
		text += "1. roka";
	} else if ((dealer + 2) % playerCount === index) {
		text += "2. roka";
	} else if ((dealer + 3) % playerCount === index) {
		text += "3. roka";
	}
	if (text == "") {
		return null;
	}
	return <div className="text-emerald-200 text-sm mb-2">{text}</div>;
};

const Actions: FC = () => {
	const { setGamestateAction } = useGameContext();
	return (
		<div className="flex flex-col gap-2 w-full">
			<ActionButton variant="red" onClick={() => setGamestateAction(-1)}>
				Garām
			</ActionButton>
			<ActionButton
				variant="purple"
				onClick={() => setGamestateAction(GameTypeEnum.Lielais)}
			>
				Lielais
			</ActionButton>
			<ActionButton
				variant="green"
				onClick={() => setGamestateAction(GameTypeEnum.Zole)}
			>
				Zole
			</ActionButton>
			<ActionButton
				variant="red"
				onClick={() => setGamestateAction(GameTypeEnum.MazaZole)}
			>
				Mazā zole
			</ActionButton>
		</div>
	);
};

const GameTypeInfo: FC<{ gameType: GameType; index: number }> = ({
	gameType,
	index,
}) => {
	const { gameResultZaudejaGaldinu, gameResultMazaZole } = useGameContext();
	if (gameType[0] === GameTypeEnum.Galdins) {
		return (
			<div className="flex flex-col items-center w-full">
				<GameTypeDisplay gameType={gameType[0]} showBackground={true} />
				<ResultButton
					variant="lose"
					className="w-full"
					onClick={() => gameResultZaudejaGaldinu(gameType, index)}
				>
					Zaudēja
				</ResultButton>
			</div>
		);
	} else if (gameType[0] === GameTypeEnum.MazaZole && gameType[1] === index) {
		return (
			<div className="flex flex-col items-center w-full">
				<GameTypeDisplay gameType={gameType[0]} showBackground={true} />
				<div className="flex gap-2 w-full">
					<ResultButton
						variant="lose"
						className="flex-1 py-2 px-3"
						onClick={() => gameResultMazaZole(gameType, false)}
					>
						Zaudēja
					</ResultButton>
					<ResultButton
						variant="win"
						className="flex-1 py-2 px-3"
						onClick={() => gameResultMazaZole(gameType, true)}
					>
						Uzvarēja
					</ResultButton>
				</div>
			</div>
		);
	}
	if (gameType[1] === index) {
		return (
			<div className="text-emerald-200 font-medium">
				<GameTypeDisplay gameType={gameType[0]} />
			</div>
		);
	}
	return null;
};

export const Route = createFileRoute("/game/$data")({
	component: RouteComponent,
	params: {
		parse: (params) => ({
			data: decompress<GameState>(params.data),
		}),
		stringify: (params) => ({
			data: compress(params.data),
		}),
	},
});
