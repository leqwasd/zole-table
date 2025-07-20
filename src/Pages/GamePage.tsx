import { FC } from "react";
import { useAppState } from "../AppContext/effects/useAppState";
import { DealerSelect } from "./Components/DealerSelect";
import { Game } from "./Components/Game";

export const GamePage: FC = () => {
	const { initialDealer: dealer } = useAppState();

	if (dealer === -1) {
		return <DealerSelect />;
	}

	return <Game />;
};
