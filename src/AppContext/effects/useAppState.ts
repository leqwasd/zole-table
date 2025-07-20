import { useAppContext } from "./useAppContext";

export function useAppState() {
	const { state } = useAppContext();
	return state;
}
