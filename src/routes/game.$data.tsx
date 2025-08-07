import { createFileRoute } from "@tanstack/react-router";
import {
	createContext,
	FC,
	PropsWithChildren,
	useCallback,
	useContext,
	useMemo,
} from "react";
import { decompress, compress } from "../utils";
import {
	Game,
	GameState,
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
const variantClasses = new Map<GameTypeEnum, string>([
	[
		GameTypeEnum.Galdins,
		"hover:bg-orange-400/20 bg-orange-400/10 text-white border-orange-500 hover:border-orange-400",
	],
	[
		GameTypeEnum.MazaZole,
		"hover:bg-red-400/20 bg-red-400/10 text-white border-red-500 hover:border-red-400",
	],
	[
		GameTypeEnum.Zole,
		"hover:bg-green-400/20 bg-green-400/10 text-white border-green-500 hover:border-green-400",
	],
	[
		GameTypeEnum.Lielais,
		"hover:bg-blue-400/20 bg-blue-400/10 text-white border-blue-500 hover:border-blue-400",
	],
]);
// Button Components
const ActionButton: FC<
	PropsWithChildren<{
		onClick: () => void;
		gameType: GameTypeEnum;
	}>
> = ({ onClick, children, gameType }) => {
	return (
		<button
			type="button"
			className={`rounded-lg border-2 px-4 py-2 text-sm font-semibold shadow-md transition-all duration-300 hover:text-white hover:shadow-lg ${variantClasses.get(gameType)}`}
			onClick={onClick}
		>
			{children}
		</button>
	);
};

function getGameTypeName(gameType: GameTypeEnum) {
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
}
function getColorClass(gameType: GameTypeEnum) {
	switch (gameType) {
		case GameTypeEnum.Galdins:
			return "text-orange-300 font-semibold";
		case GameTypeEnum.MazaZole:
			return "text-red-300 font-semibold";
		case GameTypeEnum.Zole:
			return "text-green-300 font-semibold";
		case GameTypeEnum.Lielais:
			return "text-blue-300 font-semibold";
		default:
			return "text-white font-semibold";
	}
}
// Game Type Display Component
const GameTypeDisplay: FC<{
	gameType: GameTypeEnum;
}> = ({ gameType }) => {
	return (
		<div className={"text-center font-medium"}>
			<span className={getColorClass(gameType)}>
				{getGameTypeName(gameType)}
			</span>
		</div>
	);
};

const GameContext = createContext({} as GameContext);
type GameContext = {
	state: Required<GameState>;
	gamesWithScore: GameWithScore[];
	setGamestateAction(action: GameTypeEnum): void;
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
			...data,
			games: data.games ?? [],
			preGameActions: data.preGameActions ?? [],
			gameType: data.gameType ?? null,
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
		(action: GameTypeEnum) => {
			if (action === GameTypeEnum.Galdins) {
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
		<div className="rounded-lg border border-white/20 bg-gradient-to-br from-white/20 to-white/10 px-4 py-2 shadow-lg backdrop-blur-sm">
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
									? "border-b border-emerald-400/40"
									: ""
							}
						>
							<td className="py-1 text-sm text-emerald-300">
								{i + 1}
							</td>
							{players.map((_, j) => (
								<GameCell key={j} player={j} game={game} />
							))}
							<td className="py-1 text-center text-sm text-emerald-200">
								<GameTypeDisplay gameType={game.game[0]} />
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
								className="pt-2 text-center text-lg font-bold text-emerald-100"
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
		<td className={"py-1 text-center " + gameResultClassName}>
			<span className="font-semibold text-white">
				{game.scores[player]}
			</span>{" "}
			<Diff diff={game.diff[player]} />
		</td>
	);
};

const Diff: FC<{ diff: number }> = ({ diff }) => (
	<span className="text-xs font-light text-emerald-200">
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
			<div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-3">
				<PlayedGames games={gamesWithScore} players={state.players} />
				<FlexLayout className="gap-3">
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
	preGameActions: GameTypeEnum[];
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
			className="flex min-h-[200px] flex-1 flex-col gap-2 rounded-lg border border-white/20 bg-gradient-to-br from-white/20 to-white/10 p-3 shadow-lg backdrop-blur-sm"
			data-component="CurrentGamePlayer"
		>
			<div className="text-center text-lg font-semibold text-white">
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
			className="text-center text-sm text-emerald-200"
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
			<ActionButton
				gameType={GameTypeEnum.Galdins}
				onClick={() => setGamestateAction(GameTypeEnum.Galdins)}
			>
				Garām
			</ActionButton>
			<ActionButton
				gameType={GameTypeEnum.Lielais}
				onClick={() => setGamestateAction(GameTypeEnum.Lielais)}
			>
				Lielais
			</ActionButton>
			<ActionButton
				gameType={GameTypeEnum.Zole}
				onClick={() => setGamestateAction(GameTypeEnum.Zole)}
			>
				Zole
			</ActionButton>
			<ActionButton
				gameType={GameTypeEnum.MazaZole}
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
			<GameTypeDisplay gameType={game[0]} />
			<ActionButton
				gameType={GameTypeEnum.MazaZole}
				onClick={() => gameResultZaudejaGaldinu(game, playerIndex)}
			>
				Zaudēja
			</ActionButton>
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
			<GameTypeDisplay gameType={game[0]} />
			<div className="flex flex-col gap-2">
				<ActionButton
					gameType={GameTypeEnum.Zole}
					onClick={() => gameResultMazaZole(game, true)}
				>
					Uzvarēja
				</ActionButton>
				<ActionButton
					gameType={GameTypeEnum.MazaZole}
					onClick={() => gameResultMazaZole(game, false)}
				>
					Zaudēja
				</ActionButton>
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
			<GameTypeDisplay gameType={game[0]} />
			<div className="flex gap-2">
				<div className="flex flex-1 flex-col gap-2">
					<ActionButton
						gameType={GameTypeEnum.Zole}
						onClick={() =>
							gameResultLielais(game, ZoleWinResult.win61)
						}
					>
						61 - 90 acis
					</ActionButton>
					<ActionButton
						gameType={GameTypeEnum.Zole}
						onClick={() =>
							gameResultLielais(game, ZoleWinResult.win91)
						}
					>
						91+ acis
					</ActionButton>
					<ActionButton
						gameType={GameTypeEnum.Zole}
						onClick={() =>
							gameResultLielais(game, ZoleWinResult.winAll)
						}
					>
						Visi stiķi
					</ActionButton>
				</div>
				<div className="flex flex-1 flex-col gap-2">
					<ActionButton
						gameType={GameTypeEnum.MazaZole}
						onClick={() =>
							gameResultLielais(game, ZoleLoseResult.lost30)
						}
					>
						≤30 acis
					</ActionButton>
					<ActionButton
						gameType={GameTypeEnum.MazaZole}
						onClick={() =>
							gameResultLielais(game, ZoleLoseResult.lost60)
						}
					>
						31 - 60 acis
					</ActionButton>
					<ActionButton
						gameType={GameTypeEnum.MazaZole}
						onClick={() =>
							gameResultLielais(game, ZoleLoseResult.lostAll)
						}
					>
						0 stiķi
					</ActionButton>
				</div>
			</div>
		</>
	);
};
function storeInLocalStorage(data: GameState | null) {
	if (data?.meta?.id == null) {
		return;
	}
	localStorage.setItem(`game-${data.meta.id}`, compress(data));
}
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
	onEnter: ({ params }) => storeInLocalStorage(params.data),
	onStay: ({ params }) => storeInLocalStorage(params.data),
});
