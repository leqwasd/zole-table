export function calcCurrentDealer(
	initialDealer: number,
	playerCount: number,
	playedGames: number
) {
	return (initialDealer + playedGames) % playerCount;
}
