export type Setup1 = [number];
export type Setup2 = [...Setup1, string[]];
export type Setup3 = [...Setup2, number];
export type SetupData = Setup1 | Setup2 | Setup3;

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

export type GameState = {
	players: string[];
	dealer: number;
	games?: GameWithScore[];
	preGameActions?: GameStateAction[];
	gameType?: GameType | null;
};
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

export type ZoleWinResult =
	| "Uzvar ar 61 - 90 acīm"
	| "Uzvar ar 91 vai vairāk acīm"
	| "Uzvar iegūstot visus stiķus";
export type ZoleLoseResult =
	| "Zaudē ar 31 - 60 acīm"
	| "Zaudē ar 30 un mazāk acīm"
	| "Zaudē neiegūstot nevienu stiķi";
export function convertGameStateFromSetup(setup: Setup3): GameState {
	return {
		players: setup[1],
		dealer: setup[2],
	};
}
