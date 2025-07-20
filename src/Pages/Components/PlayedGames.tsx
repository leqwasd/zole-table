import { FC, useMemo } from "react";
import { useAppState } from "../../AppContext/effects/useAppState";
import { GameWithScore } from "../../AppContext/AppContext";

export const PlayedGames: FC = () => {
	const { games, players } = useAppState();
	const totals = useMemo(
		() =>
			games.length === 0
				? new Array(state.players.length).fill(0)
				: games[games.length - 1].scores,
		[games]
	);
	return (
		<table className="w-full">
			<thead>
				<tr>
					<td />
					{players.map((name, i) => (
						<th key={i}>{name}</th>
					))}
					<td />
				</tr>
			</thead>
			<tbody>
				{games.map((game, i) => (
					<tr
						key={i}
						className={
							i % players.length === players.length - 1
								? "border-b-white/30 border-b "
								: "border-b-transparent border-b"
						}
					>
						<td>{i + 1}</td>
						{players.map((_, j) => (
							<GameCell key={j} player={j} game={game} />
						))}
						<td>{game.type}</td>
					</tr>
				))}
			</tbody>
			<tfoot>
				<tr>
					<td>Σ</td>
					{totals.map((total, i) => (
						<th key={i}>{total}</th>
					))}
				</tr>
			</tfoot>
		</table>
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
		<td className={"text-center " + gameResultClassName}>
			{game.scores[player]} <Diff diff={game.diff[player]} />
		</td>
	);
};

const Diff: FC<{ diff: number }> = ({ diff }) => (
	<span className="font-light">
		({diff > 0 && "+"}
		{diff})
	</span>
);
