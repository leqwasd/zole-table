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
		? "text-emerald-200 font-medium"
		: "";

	if (showBackground) {
		return (
			<div className={backgroundClasses + " text-center"}>
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
		<div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-white/20">
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
		({useMemo(() => (diff > 0 ? `+${diff}` : `${diff}`), [diff])})
	</span>
);

const GamePage: FC = () => {
	const { state, gamesWithScore } = useGameContext();
	const currentDealer =
		(state.dealer + state.games.length) % state.players.length;
	return (
		<div
			className="min-h-screen bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-2"
			data-component="GamePage"
		>
			<div className="max-w-6xl mx-auto relative z-10 flex flex-col gap-2">
				<PlayedGames games={gamesWithScore} players={state.players} />
				<FlexLayout className="gap-2">
					{state.players.map((player, index) => (
						<CurrentGamePlayer
							key={index}
							player={player}
							playerIndex={index}
							currentDealer={currentDealer}
							playerCount={state.players.length}
							preGameActions={state.preGameActions}
							game={state.gameType}
						/>
					))}
				</FlexLayout>
			</div>
		</div>
	);
};

const CurrentGamePlayer: FC<{
	player: string;
	playerIndex: number;
	currentDealer: number;
	playerCount: number;
	preGameActions: GameStateAction[];
	game: GameType | null;
}> = ({
	player,
	playerIndex,
	currentDealer,
	playerCount,
	preGameActions,
	game,
}) => {
	const shouldGiveAction =
		game == null &&
		(currentDealer + preGameActions.length + 1) % playerCount ===
			playerIndex;

	return (
		<div
			className="flex-1 flex flex-col gap-2 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-lg p-3 min-h-[200px] shadow-lg border border-white/20"
			data-component="CurrentGamePlayer"
		>
			<div className="text-white font-semibold text-lg text-center">
				{player}
			</div>
			<Roka
				currentDealer={currentDealer}
				playerCount={playerCount}
				playerIndex={playerIndex}
			/>

			{shouldGiveAction && <PreGameActions />}

			{game != null && (
				<GameActions
					game={game}
					playerIndex={playerIndex}
					playerCount={playerCount}
					currentDealer={currentDealer}
				/>
			)}
		</div>
	);
};

const Roka: FC<{
	currentDealer: number;
	playerCount: number;
	playerIndex: number;
}> = ({ currentDealer, playerCount, playerIndex }) => {
	let text: string | null =
		currentDealer === playerIndex ? "(Dalītājs) " : "";
	if ((currentDealer + 1) % playerCount === playerIndex) {
		text += "1. roka";
	} else if ((currentDealer + 2) % playerCount === playerIndex) {
		text += "2. roka";
	} else if ((currentDealer + 3) % playerCount === playerIndex) {
		text += "3. roka";
	}
	if (text == "") {
		return null;
	}
	return (
		<div
			className="text-emerald-200 text-sm text-center"
			data-component="Roka"
		>
			{text}
		</div>
	);
};

const PreGameActions: FC = () => {
	const { setGamestateAction } = useGameContext();
	return (
		<div className="flex flex-col gap-2" data-component="Actions">
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

const GameActions: FC<{
	game: GameType;
	playerIndex: number;
	playerCount: number;
	currentDealer: number;
}> = ({ game, playerIndex, playerCount, currentDealer }) => {
	const isPlayerOutsideGame =
		playerCount === 4 && playerIndex === currentDealer;
	if (isPlayerOutsideGame) {
		// Player is not in the game, no result to show
		return null;
	}
	switch (game[0]) {
		case GameTypeEnum.Galdins:
			return <GameActionsGaldins game={game} playerIndex={playerIndex} />;
		case GameTypeEnum.MazaZole:
			return (
				<GameActionsMazaZole game={game} playerIndex={playerIndex} />
			);
		case GameTypeEnum.Lielais:
		case GameTypeEnum.Zole:
			return <GameActionsLielais game={game} playerIndex={playerIndex} />;
		default:
			return null;
	}
};

const GameActionsGaldins: FC<{
	game: GameTypeGaldins;
	playerIndex: number;
}> = ({ game, playerIndex }) => {
	const { gameResultZaudejaGaldinu } = useGameContext();
	return (
		<>
			<GameTypeDisplay gameType={game[0]} showBackground={true} />
			<ResultButton
				variant="lose"
				className="w-full"
				onClick={() => gameResultZaudejaGaldinu(game, playerIndex)}
			>
				Zaudēja
			</ResultButton>
		</>
	);
};
const GameActionsMazaZole: FC<{
	game: GameTypeMazaZole;
	playerIndex: number;
}> = ({ game, playerIndex }) => {
	const { gameResultMazaZole } = useGameContext();
	if (game[1] !== playerIndex) {
		// Player is not the one who played Maza Zole, no result to show
		return null;
	}
	return (
		<>
			<GameTypeDisplay gameType={game[0]} showBackground={true} />
			<div className="flex flex-col gap-2">
				<ResultButton
					variant="win"
					className="flex-1 py-2 px-3"
					onClick={() => gameResultMazaZole(game, true)}
				>
					Uzvarēja
				</ResultButton>
				<ResultButton
					variant="lose"
					className="flex-1 py-2 px-3"
					onClick={() => gameResultMazaZole(game, false)}
				>
					Zaudēja
				</ResultButton>
			</div>
		</>
	);
};
const GameActionsLielais: FC<{
	game: GameTypeLielais | GameTypeZole;
	playerIndex: number;
}> = ({ game, playerIndex }) => {
	const { gameResultLielais } = useGameContext();
	if (game[1] !== playerIndex) {
		// Player is not the one who played Zole or Lielais, no result to show
		return null;
	}
	return (
		<>
			<GameTypeDisplay gameType={game[0]} showBackground={true} />
			<div className="flex gap-2">
				<div className="flex-1 flex flex-col gap-2">
					<ResultButton
						variant="win"
						onClick={() =>
							gameResultLielais(game, ZoleWinResult.win61)
						}
					>
						61 - 90 acis
					</ResultButton>
					<ResultButton
						variant="win"
						onClick={() =>
							gameResultLielais(game, ZoleWinResult.win91)
						}
					>
						91+ acis
					</ResultButton>
					<ResultButton
						variant="win"
						onClick={() =>
							gameResultLielais(game, ZoleWinResult.winAll)
						}
					>
						Visi stiķi
					</ResultButton>
				</div>
				<div className="flex-1 flex flex-col gap-2">
					<ResultButton
						variant="lose"
						onClick={() =>
							gameResultLielais(game, ZoleLoseResult.lost30)
						}
					>
						≤30 acis
					</ResultButton>
					<ResultButton
						variant="lose"
						onClick={() =>
							gameResultLielais(game, ZoleLoseResult.lost60)
						}
					>
						31 - 60 acis
					</ResultButton>
					<ResultButton
						variant="lose"
						onClick={() =>
							gameResultLielais(game, ZoleLoseResult.lostAll)
						}
					>
						0 stiķi
					</ResultButton>
				</div>
			</div>
		</>
	);
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
