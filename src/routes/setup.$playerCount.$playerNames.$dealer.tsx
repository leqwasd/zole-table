import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/setup/$playerCount/$playerNames/$dealer",
)({
	component: RouteComponent,
	parseParams: (params) => ({
		dealer: +params.dealer,
	}),
	beforeLoad: ({ params }) => {
		const dealer = params.dealer;
		if (isNaN(dealer) || dealer < 0 || dealer > params.playerCount) {
			throw new Error("Invalid dealer!");
		}
	},
});

function RouteComponent() {
	return <div>Hello "/setup/$playerCount/$playerNames/done"!</div>;
}
