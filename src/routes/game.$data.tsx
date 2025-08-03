import { createFileRoute } from "@tanstack/react-router";
import { createContext, FC, useCallback, useContext, useMemo } from "react";
import { decompress, compress } from "../utils";
import {
	Game,
	GameState,
	GameStateAction,
	GameType,
	GameTypeGaldins,
	GameTypeLielais,
	GameTypeMazaZole,
	GameTypeZole,
	GameWithScore,
	ZoleLoseResult,
	ZoleWinResult,
} from "../types";
import { FlexLayout } from "../Pages/Components/FlexLayout";

const GameContext = createContext({} as GameContext);
type GameContext = {
	state: Required<GameState>;
	setGamestateAction(action: GameStateAction): void;
	gameResultZaudejaGaldinu(gameType: GameTypeGaldins, player: number): void;
	gameResultMazaZole(gameType: GameTypeMazaZole, didWin: boolean): void;
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
	const navigate = useNavigateGame();
	const setGamestateAction = useCallback(
		(action: GameStateAction) => {
			if (action === "Garām") {
				if (state.preGameActions.length === 2) {
					return navigate({
						...state,
						gameType: {
							type: "Galdiņš",
						},
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
				gameType: {
					type: action,
					player:
						(currentDealer + state.preGameActions.length + 1) %
						state.players.length,
				},
			});
		},
		[navigate, state],
	);
	const gameResultZaudejaGaldinu = useCallback(
		(gameType: GameTypeGaldins, player: number) => {
			const scores = getPreviousScores(state);
			const game: Game = {
				...gameType,
				loser: player,
			};
			return navigate({
				...state,
				games: [...state.games, withScore(game, scores, state.players)],
				gameType: null,
				preGameActions: [],
			});
		},
		[navigate, state],
	);
	const gameResultMazaZole = useCallback(
		(gameType: GameTypeMazaZole, didWin: boolean) => {
			const scores = getPreviousScores(state);
			const game: Game = {
				...gameType,
				didWin,
			};
			return navigate({
				...state,
				games: [...state.games, withScore(game, scores, state.players)],
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
			const scores = getPreviousScores(state);
			const game: Game = {
				...gameType,
				result,
			};
			return navigate({
				...state,
				games: [...state.games, withScore(game, scores, state.players)],
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
function getPreviousScores(state: Required<GameState>): number[] {
	if (state.games.length) {
		return state.games[state.games.length - 1].scores;
	} else {
		return new Array(state.players.length).fill(0);
	}
}
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
		...game,
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
	switch (game.type) {
		case "Galdiņš":
			if (game.loser == player) {
				return PointTable.GaldinsLosePerPlayer * modifier;
			} else {
				return -PointTable.GaldinsLosePerPlayer;
			}
		case "Mazā zole":
			if (game.didWin) {
				if (game.player === player) {
					return PointTable.MazaZoleWinPerPlayer * modifier;
				} else {
					return -PointTable.MazaZoleWinPerPlayer;
				}
			} else {
				if (game.player === player) {
					return PointTable.MazaZoleLossPerPlayer * modifier;
				} else {
					return -PointTable.MazaZoleLossPerPlayer;
				}
			}
		case "Lielais":
			switch (game.result) {
				case "Uzvar ar 61 - 90 acīm":
					return player === game.player
						? PointTable.LielaisWin * modifier
						: -PointTable.LielaisWin;
				case "Uzvar ar 91 vai vairāk acīm":
					return player === game.player
						? PointTable.LielaisWinJanos * modifier
						: -PointTable.LielaisWinJanos;
				case "Uzvar iegūstot visus stiķus":
					return player === game.player
						? PointTable.LielaisWinBezstiki * modifier
						: -PointTable.LielaisWinBezstiki;
				case "Zaudē ar 31 - 60 acīm":
					return player === game.player
						? PointTable.LielaisLost * modifier
						: -PointTable.LielaisLost;
				case "Zaudē ar 30 un mazāk acīm":
					return player === game.player
						? PointTable.LielaisLostJanos * modifier
						: -PointTable.LielaisLostJanos;
				case "Zaudē neiegūstot nevienu stiķi":
					return player === game.player
						? PointTable.LielaisLostBezstiki * modifier
						: -PointTable.LielaisLostBezstiki;
				default:
					return 0;
			}
		case "Zole":
			switch (game.result) {
				case "Uzvar ar 61 - 90 acīm":
					return player === game.player
						? PointTable.ZoleWin * modifier
						: -PointTable.ZoleWin;
				case "Uzvar ar 91 vai vairāk acīm":
					return player === game.player
						? PointTable.ZoleWinJanos * modifier
						: -PointTable.ZoleWinJanos;
				case "Uzvar iegūstot visus stiķus":
					return player === game.player
						? PointTable.ZoleWinBezstiki * modifier
						: -PointTable.ZoleWinBezstiki;
				case "Zaudē ar 31 - 60 acīm":
					return player === game.player
						? PointTable.ZoleLost * modifier
						: -PointTable.ZoleLost;
				case "Zaudē ar 30 un mazāk acīm":
					return player === game.player
						? PointTable.ZoleLostJanos * modifier
						: -PointTable.ZoleLostJanos;
				case "Zaudē neiegūstot nevienu stiķi":
					return player === game.player
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
		<table className="w-full">
			<thead>
				<tr>
					<td />
					{players.map((name, i) => (
						<th key={i}>{name}</th>
					))}
					<td />
				</tr>
			</thead>
			<tbody>
				{games.map((game, i) => (
					<tr
						key={i}
						className={
							i % players.length === players.length - 1
								? "border-b-white/30 border-b "
								: "border-b-transparent border-b"
						}
					>
						<td>{i + 1}</td>
						{players.map((_, j) => (
							<GameCell key={j} player={j} game={game} />
						))}
						<td>{game.type}</td>
					</tr>
				))}
			</tbody>
			<tfoot>
				<tr>
					<td>Σ</td>
					{totals.map((total, i) => (
						<th key={i}>{total}</th>
					))}
				</tr>
			</tfoot>
		</table>
	);
};
function useGameResultClassName(player: number, game: GameWithScore): string {
	if (
		(game.type === "Lielais" || game.type === "Zole") &&
		game.player === player
	) {
		if (
			game.result === "Uzvar ar 61 - 90 acīm" ||
			game.result === "Uzvar ar 91 vai vairāk acīm" ||
			game.result === "Uzvar iegūstot visus stiķus"
		) {
			const className = "bg-green-500/50";
			return className;
		} else {
			const className = "bg-red-500/50";
			return className;
		}
	} else if (game.type === "Mazā zole" && game.player === player) {
		if (game.didWin) {
			const className = "bg-green-500/50";
			return className;
		} else {
			const className = "bg-red-500/50";
			return className;
		}
	} else if (game.type === "Galdiņš" && game.loser === player) {
		const className = "bg-red-500/50";
		return className;
	}

	return "";
}
const GameCell: FC<{ player: number; game: GameWithScore }> = ({
	player,
	game,
}) => {
	const gameResultClassName = useGameResultClassName(player, game);
	return (
		<td className={"text-center " + gameResultClassName}>
			{game.scores[player]} <Diff diff={game.diff[player]} />
		</td>
	);
};

const Diff: FC<{ diff: number }> = ({ diff }) => (
	<span className="font-light">
		({diff > 0 && "+"}
		{diff})
	</span>
);

const GamePage: FC = () => {
	const { state } = useGameContext();
	const currentDealer =
		(state.dealer + state.games.length) % state.players.length;
	return (
		<div>
			<PlayedGames games={state.games} players={state.players} />
			<FlexLayout>
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
	);
};
const GameResults: FC<{ gameType: GameType }> = ({ gameType }) => {
	const { gameResultLielais } = useGameContext();
	if (gameType.type === "Galdiņš" || gameType.type === "Mazā zole") {
		return null;
	}

	return (
		<div className="flex">
			<div className="flex-1 flex flex-col">
				<button
					type="button"
					onClick={() =>
						gameResultLielais(gameType, "Uzvar ar 61 - 90 acīm")
					}
				>
					Uzvar ar 61 - 90 acīm
				</button>
				<button
					type="button"
					onClick={() =>
						gameResultLielais(
							gameType,
							"Uzvar ar 91 vai vairāk acīm",
						)
					}
				>
					Uzvar ar 91 vai vairāk acīm
				</button>
				<button
					type="button"
					onClick={() =>
						gameResultLielais(
							gameType,
							"Uzvar iegūstot visus stiķus",
						)
					}
				>
					Uzvar iegūstot visus stiķus
				</button>
			</div>
			<div className="flex-1 flex flex-col">
				<button
					type="button"
					onClick={() =>
						gameResultLielais(gameType, "Zaudē ar 30 un mazāk acīm")
					}
				>
					Zaudē ar 30 un mazāk acīm
				</button>
				<button
					type="button"
					onClick={() =>
						gameResultLielais(gameType, "Zaudē ar 31 - 60 acīm")
					}
				>
					Zaudē ar 31 - 60 acīm
				</button>
				<button
					type="button"
					onClick={() =>
						gameResultLielais(
							gameType,
							"Zaudē neiegūstot nevienu stiķi",
						)
					}
				>
					Zaudē neiegūstot nevienu stiķi
				</button>
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
		<div className="flex-1 flex flex-col items-center bg-white/20">
			<div>{player}</div>
			{dealer === index && <div>Dalītājs</div>}
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
	let text: string | null = null;
	if ((dealer + 1) % playerCount === index) {
		text = "1. roka";
	} else if ((dealer + 2) % playerCount === index) {
		text = "2. roka";
	} else if ((dealer + 3) % playerCount === index) {
		text = "3. roka";
	}
	if (text == null) {
		return null;
	}
	return <div>{text}</div>;
};

const Actions: FC = () => {
	const { setGamestateAction } = useGameContext();
	const onGaramClick = useCallback(
		() => setGamestateAction("Garām"),
		[setGamestateAction],
	);
	const onLielaisClick = useCallback(
		() => setGamestateAction("Lielais"),
		[setGamestateAction],
	);
	const onZoleClick = useCallback(
		() => setGamestateAction("Zole"),
		[setGamestateAction],
	);
	const onMazaZoleClick = useCallback(
		() => setGamestateAction("Mazā zole"),
		[setGamestateAction],
	);
	return (
		<div className="flex flex-col gap-1">
			<button type="button" onClick={onGaramClick}>
				Garām
			</button>
			<button type="button" onClick={onLielaisClick}>
				Lielais
			</button>
			<button type="button" onClick={onZoleClick}>
				Zole
			</button>
			<button type="button" onClick={onMazaZoleClick}>
				Mazā zole
			</button>
		</div>
	);
};

const GameTypeInfo: FC<{ gameType: GameType; index: number }> = ({
	gameType,
	index,
}) => {
	const { gameResultZaudejaGaldinu, gameResultMazaZole } = useGameContext();
	if (gameType.type === "Galdiņš") {
		return (
			<>
				<div>{gameType.type}</div>
				<button
					type="button"
					onClick={() => gameResultZaudejaGaldinu(gameType, index)}
				>
					Zaudēja
				</button>
			</>
		);
	} else if (gameType.type === "Mazā zole") {
		return (
			<>
				<div>{gameType.type}</div>
				<div>
					<button
						type="button"
						onClick={() => gameResultMazaZole(gameType, false)}
					>
						Zaudēja
					</button>
					<button
						type="button"
						onClick={() => gameResultMazaZole(gameType, true)}
					>
						Uzvarēja
					</button>
				</div>
			</>
		);
	}
	if (gameType.player === index) {
		return <div>{gameType.type}</div>;
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
