import { AppAction, GameStateAction } from "../AppContext";
import { calcCurrentDealer } from "../utils";

export type SetGamestateAction = {
	type: "set_gamestate_action";
	action: GameStateAction;
};
export const SetGamestateAction: AppAction<SetGamestateAction> = (
	state,
	{ action }
) => {
	if (action === "Garām") {
		if (state.preGameActions.length === 2) {
			return {
				...state,
				gameType: {
					type: "Galdiņš",
				},
			};
		} else {
			return {
				...state,
				preGameActions: state.preGameActions.concat(action),
			};
		}
	}
	const currentDealer = calcCurrentDealer(
		state.initialDealer,
		state.players.length,
		state.games.length
	);
	return {
		...state,
		gameType: {
			type: action,
			player:
				(currentDealer + state.preGameActions.length + 1) %
				state.players.length,
		},
	};
	// TODO: setup lielais / zole / maza zole
	return state;
};
