import { FC, useMemo, ReactNode } from "react";
import { useAppState } from "../../AppContext/effects/useAppState";
import { GameWithScore } from "../../AppContext/AppContext";

// Reusable table components
const GameTable: FC<{ children: ReactNode }> = ({ children }) => (
	<table className="w-full">{children}</table>
);

const GameTableHeader: FC<{ children: ReactNode }> = ({ children }) => (
	<thead>{children}</thead>
);

const GameTableBody: FC<{ children: ReactNode }> = ({ children }) => (
	<tbody>{children}</tbody>
);

const GameTableFooter: FC<{ children: ReactNode }> = ({ children }) => (
	<tfoot>{children}</tfoot>
);

const GameTableRow: FC<{
	children: ReactNode;
	isGameEnd?: boolean;
	index?: number;
	playersCount?: number;
}> = ({ children, isGameEnd = false, index, playersCount }) => {
	const shouldShowBorder =
		isGameEnd ||
		(index !== undefined &&
			playersCount !== undefined &&
			index % playersCount === playersCount - 1);

	return (
		<tr
			className={
				shouldShowBorder
					? "border-b-white/30 border-b"
					: "border-b-transparent border-b"
			}
		>
			{children}
		</tr>
	);
};

const GameTableCell: FC<{
	children: ReactNode;
	isHeader?: boolean;
	align?: "left" | "center" | "right";
	background?: string;
}> = ({ children, isHeader = false, align = "left", background = "" }) => {
	const alignClass = {
		left: "",
		center: "text-center",
		right: "text-right",
	}[align];

	const className = `${alignClass} ${background}`.trim();

	return isHeader ? (
		<th className={className}>{children}</th>
	) : (
		<td className={className}>{children}</td>
	);
};

export const PlayedGames: FC = () => {
	const { games, players } = useAppState();
	const totals = useMemo(
		() =>
			games.length === 0
				? new Array(players.length).fill(0)
				: games[games.length - 1].scores,
		[games, players.length],
	);

	return (
		<GameTable>
			<GameTableHeader>
				<GameTableRow>
					<GameTableCell>{""}</GameTableCell>
					{players.map((name, i) => (
						<GameTableCell key={i} isHeader>
							{name}
						</GameTableCell>
					))}
					<GameTableCell>{""}</GameTableCell>
				</GameTableRow>
			</GameTableHeader>
			<GameTableBody>
				{games.map((game, i) => (
					<GameTableRow
						key={i}
						index={i}
						playersCount={players.length}
					>
						<GameTableCell>{i + 1}</GameTableCell>
						{players.map((_, j) => (
							<GameCell key={j} player={j} game={game} />
						))}
						<GameTableCell>{game.type}</GameTableCell>
					</GameTableRow>
				))}
			</GameTableBody>
			<GameTableFooter>
				<GameTableRow>
					<GameTableCell>Σ</GameTableCell>
					{totals.map((total, i) => (
						<GameTableCell key={i} isHeader>
							{total}
						</GameTableCell>
					))}
					<GameTableCell>{""}</GameTableCell>
				</GameTableRow>
			</GameTableFooter>
		</GameTable>
	);
};
function useGameResultClassName(player: number, game: GameWithScore): string {
	if (
		(game.type === "Lielais" || game.type === "Zole") &&
		game.player === player
	) {
		if (
			game.result === "Uzvar ar 61 - 90 acīm" ||
			game.result === "Uzvar ar 91 vai vairāk acīm" ||
			game.result === "Uzvar iegūstot visus stiķus"
		) {
			const className = "bg-green-500/50";
			return className;
		} else {
			const className = "bg-red-500/50";
			return className;
		}
	} else if (game.type === "Mazā zole" && game.player === player) {
		if (game.didWin) {
			const className = "bg-green-500/50";
			return className;
		} else {
			const className = "bg-red-500/50";
			return className;
		}
	} else if (game.type === "Galdiņš" && game.loser === player) {
		const className = "bg-red-500/50";
		return className;
	}

	return "";
}
const GameCell: FC<{ player: number; game: GameWithScore }> = ({
	player,
	game,
}) => {
	const gameResultClassName = useGameResultClassName(player, game);
	return (
		<GameTableCell align="center" background={gameResultClassName}>
			{game.scores[player]} <Diff diff={game.diff[player]} />
		</GameTableCell>
	);
};

const Diff: FC<{ diff: number }> = ({ diff }) => (
	<span className="font-light">
		({diff > 0 && "+"}
		{diff})
	</span>
);
