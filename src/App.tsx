import { FC } from "react";
import { useAppState } from "./AppContext/effects/useAppState";
import { SetupPage } from "./Pages/SetupPage";
import { GamePage } from "./Pages/GamePage";

export const App: FC = () => {
	const { players } = useAppState();
	if (players.length === 0) {
		return <SetupPage />;
	}
	return <GamePage />;
};
