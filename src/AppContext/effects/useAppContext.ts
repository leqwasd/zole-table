import { useContext } from "react";
import { AppContext } from "../AppContext";

export function useAppContext() {
	const ctx = useContext(AppContext);
	if (ctx == null) throw new Error("AppContext is null here!");
	return ctx;
}
