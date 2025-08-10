import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import {
	FC,
	FormEventHandler,
	useCallback,
	useMemo,
	useRef,
	ReactNode,
} from "react";
import { compress, decompress } from "../utils";
import { FlexLayout } from "../components/FlexLayout";
import { convertGameStateFromSetup, Setup1, Setup2, SetupData } from "../types";

// Reusable Setup Page Components
const SetupPageLayout: FC<{ children: ReactNode; title: string }> = ({
	children,
	title,
}) => (
	<div className="flex flex-col items-center justify-center p-4">
		<h1 className="mb-8 text-center text-3xl font-bold text-white drop-shadow-lg">
			{title}
		</h1>
		<div className="w-full max-w-md">{children}</div>
	</div>
);

const SetupButton: FC<{
	children: ReactNode;
	data: SetupData;
}> = ({ children, data }) => (
	<Link
		className="flex-1 rounded-lg bg-gradient-to-br from-white/20 to-white/10 p-12 text-center text-4xl font-bold text-white shadow-lg transition-all duration-300 hover:from-white/30 hover:to-white/20 hover:shadow-xl"
		to="/new/{-$data}"
		params={{ data }}
	>
		{children}
	</Link>
);

const SetupPrimaryButton: FC<{
	children: ReactNode;
}> = ({ children }) => (
	<button
		type="submit"
		className="mt-6 w-full rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-3 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:from-emerald-700 hover:to-emerald-800 hover:shadow-xl"
	>
		{children}
	</button>
);

const SetupInput: FC<{ placeholder: string }> = ({ placeholder }) => (
	<input
		type="text"
		name="playername"
		defaultValue={placeholder}
		className="block w-full flex-1 rounded-lg border border-white/40 bg-gradient-to-r from-white/25 to-white/15 p-3 text-lg text-white placeholder-white/70 shadow-lg transition-all duration-300 focus:border-emerald-300 focus:from-white/35 focus:to-white/25 focus:ring-2 focus:ring-emerald-300"
		required
		placeholder={placeholder}
	/>
);

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
		<SetupPageLayout title="Izvēlies spēlētāju skaitu">
			<FlexLayout className="gap-4">
				<SetupButton data={[3]}>3</SetupButton>
				<SetupButton data={[4]}>4</SetupButton>
			</FlexLayout>
		</SetupPageLayout>
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
				to: "/new/{-$data}",
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
		<SetupPageLayout title="Ievadi spēlētāju vārdus">
			<form ref={formRef} onSubmit={onSubmit} className="space-y-4">
				<FlexLayout className="gap-4">
					{placeholders.map((placeholder, i) => (
						<SetupInput key={i} placeholder={placeholder} />
					))}
				</FlexLayout>
				<SetupPrimaryButton>Turpināt</SetupPrimaryButton>
			</form>
		</SetupPageLayout>
	);
};
const DealerSelectPage: FC<{ setup: Setup2 }> = ({ setup }) => {
	return (
		<SetupPageLayout title="Izvēlies sākuma dalītāju">
			<FlexLayout className="gap-4">
				{setup[1].map((name, dealer) => (
					<SetupButton key={dealer} data={[...setup, dealer]}>
						{name}
					</SetupButton>
				))}
			</FlexLayout>
		</SetupPageLayout>
	);
};

export const Route = createFileRoute("/new/{-$data}")({
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
