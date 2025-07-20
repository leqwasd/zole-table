import { useAppContext } from "./useAppContext";

export function useAppDispatch() {
	const { dispatch } = useAppContext();
	return dispatch;
}
