export type Setup1 = [number];
export type Setup2 = [...Setup1, string[]];
export type Setup3 = [...Setup2, number];
export type SetupData = Setup1 | Setup2 | Setup3;

export const enum GameTypeEnum {
	Galdins = 0,
	MazaZole = 1,
	Zole = 2,
	Lielais = 3,
}

export type GameStateAction =
	| -1
	| GameTypeEnum.Lielais
	| GameTypeEnum.Zole
	| GameTypeEnum.MazaZole;

export type GameTypeGaldins = {
	type: GameTypeEnum.Galdins;
};
export type GameTypeMazaZole = {
	type: GameTypeEnum.MazaZole;
	player: number;
};
export type GameTypeZole = {
	type: GameTypeEnum.Zole;
	player: number;
};
export type GameTypeLielais = {
	type: GameTypeEnum.Lielais;
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
	games?: Game[];
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
export type GameTypeMazaZoleResult = GameTypeMazaZole & { result: boolean };
export type GameTypeZoleResult = GameTypeZole & {
	result: ZoleWinResult | ZoleLoseResult;
};
export type GameTypeLielaisResult = GameTypeLielais & {
	result: ZoleWinResult | ZoleLoseResult;
};

export const enum ZoleWinResult {
	win61 = 1,
	win91 = 2,
	winAll = 3,
}
export const enum ZoleLoseResult {
	lost60 = -1,
	lost30 = -2,
	lostAll = -3,
}
export function convertGameStateFromSetup(setup: Setup3): GameState {
	return {
		players: setup[1],
		dealer: setup[2],
	};
}
