import { createFileRoute } from "@tanstack/react-router";
import { FC, FormEventHandler, useCallback, useMemo, useRef } from "react";
import { FlexLayout } from "../Pages/Components/FlexLayout";

const RouteComponent: FC = () => {
	const formRef = useRef<HTMLFormElement>(null);
	const { playerCount } = Route.useParams(); // Now typed as number
	const navigate = Route.useNavigate();
	const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
		(e) => {
			e.preventDefault();
			navigate({
				to: "/setup/$playerCount/$playerNames",
				params: {
					playerCount,
					playerNames: JSON.stringify(
						Array.from(new FormData(formRef.current!).values()),
					),
				},
			});
		},
		[navigate, playerCount],
	);

	// Generate placeholders based on player count
	const placeholders = useMemo(
		() => Array.from({ length: playerCount }, (_, i) => `Player ${i + 1}`),
		[playerCount],
	);

	return (
		<form ref={formRef} onSubmit={onSubmit}>
			<FlexLayout>
				{placeholders.map((placeholder, i) => (
					<PlayerNameInput key={i} placeholder={placeholder} />
				))}
			</FlexLayout>
			<button
				type="submit"
				className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
			>
				Submit
			</button>
		</form>
	);
};

const PlayerNameInput: FC<{ placeholder: string }> = ({ placeholder }) => (
	<input
		type="text"
		name="playername"
		defaultValue={placeholder}
		className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
		required
		placeholder={placeholder}
	/>
);

export const Route = createFileRoute("/setup/$playerCount/")({
	component: RouteComponent,
});
