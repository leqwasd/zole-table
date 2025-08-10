import { FC } from "react";
import { GameTypeEnum } from "../types";

function getGameTypeName(gameType: GameTypeEnum) {
	switch (gameType) {
		case GameTypeEnum.Galdins:
			return "Galdiņš";
		case GameTypeEnum.MazaZole:
			return "Mazā zole";
		case GameTypeEnum.Zole:
			return "Zole";
		case GameTypeEnum.Lielais:
			return "Lielais";
		default:
			return "";
	}
}
function getColorClass(gameType: GameTypeEnum) {
	switch (gameType) {
		case GameTypeEnum.Galdins:
			return "text-orange-300 font-semibold";
		case GameTypeEnum.MazaZole:
			return "text-red-300 font-semibold";
		case GameTypeEnum.Zole:
			return "text-green-300 font-semibold";
		case GameTypeEnum.Lielais:
			return "text-blue-300 font-semibold";
		default:
			return "text-white font-semibold";
	}
}
// Game Type Display Component
export const GameTypeDisplay: FC<{
	gameType: GameTypeEnum;
}> = ({ gameType }) => {
	return (
		<div className={"text-center font-medium"}>
			<span className={getColorClass(gameType)}>
				{getGameTypeName(gameType)}
			</span>
		</div>
	);
};
