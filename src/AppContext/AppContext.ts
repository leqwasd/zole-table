import { ActionDispatch, createContext } from "react";
import { Actions } from "./actions/AppContextReducer";
import { ZoleLoseResult, ZoleWinResult } from "./actions/GameResultAction";

export type PlayerCount = 3 | 4;

export type Game =
	| GameTypeGaldinsResult
	| GameTypeMazaZoleResult
	| GameTypeZoleResult
	| GameTypeLielaisResult;
export type GameWithScore = Game & { scores: number[]; diff: number[] };
export type GameTypeGaldinsResult = GameTypeGaldins & { loser: number };
export type GameTypeMazaZoleResult = GameTypeMazaZole & { didWin: boolean };
export type GameTypeZoleResult = GameTypeZole & {
	result: ZoleWinResult | ZoleLoseResult;
};
export type GameTypeLielaisResult = GameTypeLielais & {
	result: ZoleWinResult | ZoleLoseResult;
};
export type GameStateAction = "Garām" | "Lielais" | "Zole" | "Mazā zole";

export type GameTypeGaldins = {
	type: "Galdiņš";
};
export type GameTypeMazaZole = {
	type: "Mazā zole";
	player: number;
};
export type GameTypeZole = {
	type: "Zole";
	player: number;
};
export type GameTypeLielais = {
	type: "Lielais";
	player: number;
};
export type GameType =
	| GameTypeGaldins
	| GameTypeMazaZole
	| GameTypeZole
	| GameTypeLielais;
export type AppContextValue = {
	players: string[];
	initialDealer: number;
	games: GameWithScore[];
	preGameActions: GameStateAction[];
	gameType: GameType | null;
};
export const PreGameActions_Default: GameStateAction[] = [];
export const AppContext_Default: AppContextValue = {
	players: [],
	games: [],
	initialDealer: -1,
	preGameActions: PreGameActions_Default,
	gameType: null,
};
export const AppContext = createContext<{
	state: AppContextValue;
	dispatch: ActionDispatch<[action: Actions]>;
}>({
	state: AppContext_Default,
	dispatch: () => {},
});
export type AppAction<T> = (
	prevState: AppContextValue,
	action: T
) => AppContextValue;
