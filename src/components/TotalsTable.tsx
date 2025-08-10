import { FC, useMemo } from "react";
import { GameTypeEnum, GameWithScore, ZoleWinResult } from "../types";
import { GameTypeDisplay } from "./GameTypeDisplay";

export const TotalsTable: FC<{
	games: GameWithScore[];
	players: string[];
}> = ({ games, players }) => {
	const totals = useMemo(
		() =>
			games.length === 0
				? new Array(players.length).fill(0)
				: games[games.length - 1].scores,
		[games, players.length],
	);
	return (
		<table className="w-full text-white">
			<thead>
				<tr className="border-b border-emerald-400/30">
					<td className="pb-2 text-sm text-emerald-200">#</td>
					{players.map((name, i) => (
						<th
							key={i}
							className="pb-2 text-center font-semibold text-emerald-100"
						>
							{name}
						</th>
					))}
					<td className="pb-2" />
				</tr>
			</thead>
			<tbody>
				{games.map((game, i) => (
					<tr
						key={i}
						className={
							i % players.length === players.length - 1
								? "border-b border-emerald-400/40"
								: ""
						}
					>
						<td className="py-1 text-sm text-emerald-300">
							{i + 1}
						</td>
						{players.map((_, j) => (
							<GameCell key={j} player={j} game={game} />
						))}
						<td className="py-1 text-center text-sm text-emerald-200">
							<GameTypeDisplay gameType={game.game[0]} />
						</td>
					</tr>
				))}
			</tbody>
			<tfoot>
				<tr className="border-t border-emerald-400/30">
					<td className="pt-2 font-bold text-emerald-100">Σ</td>
					{totals.map((total, i) => (
						<th
							key={i}
							className="pt-2 text-center text-lg font-bold text-emerald-100"
						>
							{total}
						</th>
					))}
					<td className="pt-2" />
				</tr>
			</tfoot>
		</table>
	);
};

const GameCell: FC<{ player: number; game: GameWithScore }> = ({
	player,
	game,
}) => {
	const gameResultClassName = useGameResultClassName(player, game);
	return (
		<td className={"py-1 text-center " + gameResultClassName}>
			<span className="font-semibold text-white">
				{game.scores[player]}
			</span>{" "}
			<Diff diff={game.diff[player]} />
		</td>
	);
};

const Diff: FC<{ diff: number }> = ({ diff }) => (
	<span className="text-xs font-light text-emerald-200">
		({useMemo(() => (diff > 0 ? `+${diff}` : `${diff}`), [diff])})
	</span>
);

function useGameResultClassName(
	player: number,
	gameWithScore: GameWithScore,
): string {
	const { game } = gameWithScore;
	if (
		(game[0] === GameTypeEnum.Lielais || game[0] === GameTypeEnum.Zole) &&
		game[1] === player
	) {
		if (
			game[2] === ZoleWinResult.win61 ||
			game[2] === ZoleWinResult.win91 ||
			game[2] === ZoleWinResult.winAll
		) {
			return "bg-green-500/30 border border-green-400/50";
		} else {
			return "bg-red-500/30 border border-red-400/50";
		}
	} else if (game[0] === GameTypeEnum.MazaZole && game[1] === player) {
		if (game[2]) {
			return "bg-green-500/30 border border-green-400/50";
		} else {
			return "bg-red-500/30 border border-red-400/50";
		}
	} else if (game[0] === GameTypeEnum.Galdins && game[1] === player) {
		return "bg-red-500/30 border border-red-400/50";
	}

	return "";
}
