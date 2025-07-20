import { AppAction, PreGameActions_Default } from "../AppContext";
export type DealerSelectAction = {
	type: "select_dealer";
	dealer: number;
};
export const DealerSelectAction: AppAction<DealerSelectAction> = (
	state,
	{ dealer }
) => {
	return {
		...state,
		initialDealer: dealer,
		preGameActions: PreGameActions_Default,
	};
};
