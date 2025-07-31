import { FC, PropsWithChildren, useReducer } from "react";
import { AppContext, AppContext_Default, AppContextValue } from "./AppContext";
import { AppContextReducer } from "./actions/AppContextReducer";
import { compress } from "lz-string";

declare global {
	// eslint-disable-next-line no-var
	var state: AppContextValue;
}
export const AppContextProvider: FC<PropsWithChildren> = ({ children }) => {
	const [state, dispatch] = useReducer(AppContextReducer, AppContext_Default);
	globalThis.state = state;
	const a = JSON.stringify(state);
	const b = compress(a);
	console.log(a.length, b.length);

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
