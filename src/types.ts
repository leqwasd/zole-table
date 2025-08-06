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

export type GameTypeGaldins = [gameType: GameTypeEnum.Galdins];
export type GameTypeMazaZole = [
	gameType: GameTypeEnum.MazaZole,
	player: number,
];
export type GameTypeZole = [gameType: GameTypeEnum.Zole, player: number];
export type GameTypeLielais = [gameType: GameTypeEnum.Lielais, player: number];
export type GameType =
	| GameTypeGaldins
	| GameTypeMazaZole
	| GameTypeZole
	| GameTypeLielais;

export type GameMeta = {
	id: string;
	date: string;
};

export type GameState = {
	meta: GameMeta;
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
export type GameWithScore = { game: Game; scores: number[]; diff: number[] };
export type GameTypeGaldinsResult = [...GameTypeGaldins, loser: number];
export type GameTypeMazaZoleResult = [...GameTypeMazaZole, result: number];
export type GameTypeZoleResult = [
	...GameTypeZole,
	result: ZoleWinResult | ZoleLoseResult,
];
export type GameTypeLielaisResult = [
	...GameTypeLielais,
	result: ZoleWinResult | ZoleLoseResult,
];

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
		meta: {
			id: crypto.randomUUID(),
			date: new Date().toISOString(),
		},
	};
}
