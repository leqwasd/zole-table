import { AppContextValue } from "../AppContext";
import { DealerSelectAction } from "./DeakerSelectAction";
import {
	GaldinsResultAction,
	LielaisResultAction,
	MazaZoleResultAction,
} from "./GameResultAction";
import { SetGamestateAction } from "./SetGamestateAction";
import { SetupAction } from "./SetupAction";

export type Actions =
	| SetupAction
	| DealerSelectAction
	| SetGamestateAction
	| GaldinsResultAction
	| MazaZoleResultAction
	| LielaisResultAction;

export function AppContextReducer(
	state: AppContextValue,
	action: Actions
): AppContextValue {
	switch (action.type) {
		case "setup":
			return SetupAction(state, action);
		case "select_dealer":
			return DealerSelectAction(state, action);
		case "set_gamestate_action":
			return SetGamestateAction(state, action);
		case "gameresult__zaudeja_galdinu":
			return GaldinsResultAction(state, action);
		case "gameresult__maza_zole":
			return MazaZoleResultAction(state, action);
		case "gameresult__zole":
			return LielaisResultAction(state, action);
	}
	return state;
}
