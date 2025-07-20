import { FC, useCallback } from "react";
import { useAppState } from "../../AppContext/effects/useAppState";
import { GameStateAction, GameType } from "../../AppContext/AppContext";
import { FlexLayout } from "./FlexLayout";
import { useAppDispatch } from "../../AppContext/effects/useAppDispatch";
import { calcCurrentDealer } from "../../AppContext/utils";
import { PlayedGames } from "./PlayedGames";

export const Game: FC = () => {
	return (
		<>
			<PlayedGames />
			<CurrentGame />
		</>
	);
};

const CurrentGame: FC = () => {
	const { initialDealer, games, preGameActions, players, gameType } =
		useAppState();
	const playerCount = players.length;
	const currentDealer = calcCurrentDealer(
		initialDealer,
		players.length,
		games.length
	);
	return (
		<>
			<FlexLayout>
				{players.map((player, index) => (
					<CurrentGamePlayer
						key={index}
						player={player}
						index={index}
						dealer={currentDealer}
						playerCount={playerCount}
						preGameActions={preGameActions}
						gameType={gameType}
					/>
				))}
			</FlexLayout>
			{gameType != null && <GameResults gameType={gameType} />}
		</>
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
	const dispatch = useAppDispatch();
	const onGaramClick = useCallback(() => {
		dispatch({ type: "set_gamestate_action", action: "Garām" });
	}, [dispatch]);
	const onLielaisClick = useCallback(() => {
		dispatch({ type: "set_gamestate_action", action: "Lielais" });
	}, [dispatch]);
	const onZoleClick = useCallback(() => {
		dispatch({ type: "set_gamestate_action", action: "Zole" });
	}, [dispatch]);
	const onMazaZoleClick = useCallback(() => {
		dispatch({ type: "set_gamestate_action", action: "Mazā zole" });
	}, [dispatch]);
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
	const dispatch = useAppDispatch();
	if (gameType.type === "Galdiņš") {
		return (
			<>
				<div>{gameType.type}</div>
				<button
					type="button"
					onClick={() =>
						dispatch({
							type: "gameresult__zaudeja_galdinu",
							player: index,
							gameType,
						})
					}
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
						onClick={() =>
							dispatch({
								type: "gameresult__maza_zole",
								didWin: true,
								gameType,
							})
						}
					>
						Zaudēja
					</button>
					<button
						type="button"
						onClick={() =>
							dispatch({
								type: "gameresult__maza_zole",
								didWin: true,
								gameType,
							})
						}
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

const GameResults: FC<{ gameType: GameType }> = ({ gameType }) => {
	const dispatch = useAppDispatch();
	if (gameType.type === "Galdiņš" || gameType.type === "Mazā zole") {
		return null;
	}

	return (
		<div className="flex">
			<div className="flex-1 flex flex-col">
				<button
					type="button"
					onClick={() =>
						dispatch({
							type: "gameresult__zole",
							result: "Uzvar ar 61 - 90 acīm",
							gameType,
						})
					}
				>
					Uzvar ar 61 - 90 acīm
				</button>
				<button
					type="button"
					onClick={() =>
						dispatch({
							type: "gameresult__zole",
							result: "Uzvar ar 91 vai vairāk acīm",
							gameType,
						})
					}
				>
					Uzvar ar 91 vai vairāk acīm
				</button>
				<button
					type="button"
					onClick={() =>
						dispatch({
							type: "gameresult__zole",
							result: "Uzvar iegūstot visus stiķus",
							gameType,
						})
					}
				>
					Uzvar iegūstot visus stiķus
				</button>
			</div>
			<div className="flex-1 flex flex-col">
				<button
					type="button"
					onClick={() =>
						dispatch({
							type: "gameresult__zole",
							result: "Zaudē ar 30 un mazāk acīm",
							gameType,
						})
					}
				>
					Zaudē ar 30 un mazāk acīm
				</button>
				<button
					type="button"
					onClick={() =>
						dispatch({
							type: "gameresult__zole",
							result: "Zaudē ar 31 - 60 acīm",
							gameType,
						})
					}
				>
					Zaudē ar 31 - 60 acīm
				</button>
				<button
					type="button"
					onClick={() =>
						dispatch({
							type: "gameresult__zole",
							result: "Zaudē neiegūstot nevienu stiķi",
							gameType,
						})
					}
				>
					Zaudē neiegūstot nevienu stiķi
				</button>
			</div>
		</div>
	);
};
