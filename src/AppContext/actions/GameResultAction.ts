import {
	AppAction,
	AppContextValue,
	Game,
	GameTypeGaldins,
	GameTypeLielais,
	GameTypeMazaZole,
	GameTypeZole,
	GameWithScore,
} from "../AppContext";
import { PointTable } from "./PointTable";

export type GaldinsResultAction = {
	type: "gameresult__zaudeja_galdinu";
	gameType: GameTypeGaldins;
	player: number;
};
export const GaldinsResultAction: AppAction<GaldinsResultAction> = (
	state,
	{ player, gameType }
) => {
	const scores = getPreviousScores(state);
	const game: Game = {
		...gameType,
		loser: player,
	};
	return {
		...state,
		games: [...state.games, withScore(game, scores)],
		gameType: null,
		preGameActions: [],
	};
};
export type MazaZoleResultAction = {
	type: "gameresult__maza_zole";
	didWin: boolean;
	gameType: GameTypeMazaZole;
};
export const MazaZoleResultAction: AppAction<MazaZoleResultAction> = (
	state,
	{ didWin, gameType }
) => {
	const scores = getPreviousScores(state);
	const game: Game = {
		...gameType,
		didWin,
	};
	return {
		...state,
		games: [...state.games, withScore(game, scores)],
		gameType: null,
		preGameActions: [],
	};
};

export type ZoleWinResult =
	| "Uzvar ar 61 - 90 acīm"
	| "Uzvar ar 91 vai vairāk acīm"
	| "Uzvar iegūstot visus stiķus";
export type ZoleLoseResult =
	| "Zaudē ar 31 - 60 acīm"
	| "Zaudē ar 30 un mazāk acīm"
	| "Zaudē neiegūstot nevienu stiķi";

export type LielaisResultAction = {
	type: "gameresult__zole";
	result: ZoleWinResult | ZoleLoseResult;
	gameType: GameTypeZole | GameTypeLielais;
};
export const LielaisResultAction: AppAction<LielaisResultAction> = (
	state,
	{ result, gameType }
) => {
	const scores = getPreviousScores(state);
	const game: Game = {
		...gameType,
		result,
	};
	return {
		...state,
		games: [...state.games, withScore(game, scores)],
		gameType: null,
		preGameActions: [],
	};
};

function getPreviousScores(state: AppContextValue): number[] {
	if (state.games.length) {
		return state.games[state.games.length - 1].scores;
	} else {
		return new Array(state.players.length).fill(0);
	}
}
function getPointsForGameForPlayer(
	game: Game,
	player: number,
	playerCount: number
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

function withScore(game: Game, previousScores: number[]): GameWithScore {
	const diff = state.players.map((_, i) =>
		getPointsForGameForPlayer(game, i, state.players.length)
	);
	const scores = previousScores.map((score, i) => score + diff[i]);
	return {
		...game,
		diff,
		scores,
	};
}
