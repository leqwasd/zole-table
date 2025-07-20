import { FC, PropsWithChildren, useReducer } from "react";
import { AppContext, AppContext_Default, AppContextValue } from "./AppContext";
import { AppContextReducer } from "./actions/AppContextReducer";

declare global {
	// eslint-disable-next-line no-var
	var state: AppContextValue;
}
export const AppContextProvider: FC<PropsWithChildren> = ({ children }) => {
	const [state, dispatch] = useReducer(AppContextReducer, AppContext_Default);
	globalThis.state = state;
	return (
		<AppContext.Provider
			value={{
				dispatch,
				state,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
