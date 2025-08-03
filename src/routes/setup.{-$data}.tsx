import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { FC, FormEventHandler, useCallback, useMemo, useRef } from "react";
import { compress, decompress } from "../utils";
import { FlexLayout } from "../Pages/Components/FlexLayout";
import { convertGameStateFromSetup, Setup1, Setup2, SetupData } from "../types";

const RouteComponent: FC = () => {
	const { data } = Route.useParams();
	if (data == null) {
		return <PlayerCountPage />;
	} else if (data.length === 1) {
		return <PlayerNamesPage setup={data} />;
	} else if (data.length === 2) {
		return <DealerSelectPage setup={data} />;
	} else if (data.length === 3) {
		// Shouldn't happen here, see redirect in the loader
		return null;
	}
	// Shouldn't happen here
	return (
		<div>
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</div>
	);
};

const PlayerCountPage: FC = () => {
	return (
		<FlexLayout>
			<Link
				className="flex-1 p-10 text-3xl"
				to={"/setup/{-$data}"}
				params={{
					data: [3],
				}}
			>
				3
			</Link>
			<Link
				className="flex-1 p-10 text-3xl"
				to={"/setup/{-$data}"}
				params={{
					data: [4],
				}}
			>
				4
			</Link>
		</FlexLayout>
	);
};
const PlayerNamesPage: FC<{ setup: Setup1 }> = ({ setup }) => {
	const playerCount = setup[0];
	const formRef = useRef<HTMLFormElement>(null);
	const navigate = Route.useNavigate();
	const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
		(e) => {
			e.preventDefault();
			navigate({
				to: "/setup/{-$data}",
				params: {
					data: [
						...setup,
						Array.from(
							new FormData(formRef.current!).values(),
						) as string[],
					],
				},
			});
		},
		[navigate, setup],
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
const DealerSelectPage: FC<{ setup: Setup2 }> = ({ setup }) => {
	return (
		<FlexLayout>
			{setup[1].map((name, dealer) => (
				<Link
					key={dealer}
					className="flex-1 p-10 text-3xl"
					to="/setup/{-$data}"
					params={{ data: [...setup, dealer] }}
				>
					{name}
				</Link>
			))}
		</FlexLayout>
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

export const Route = createFileRoute("/setup/{-$data}")({
	component: RouteComponent,
	params: {
		parse: (params) => ({
			data:
				params.data == null
					? undefined
					: decompress<SetupData>(params.data),
		}),
		stringify: (params) => ({
			data: params.data == null ? undefined : compress(params.data),
		}),
	},
	loader: ({ params }) => {
		if (params.data && params.data.length === 3) {
			throw redirect({
				to: "/game/$data",
				params: {
					data: convertGameStateFromSetup(params.data),
				},
			});
		}
	},
});
