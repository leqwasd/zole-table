import { AppAction } from "../AppContext";
export type SetupAction = {
	type: "setup";
	players: string[];
};
export const SetupAction: AppAction<SetupAction> = (state, { players }) => {
	return {
		...state,
		players,
	};
};
