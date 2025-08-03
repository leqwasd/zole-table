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
import { FlexLayout } from "../Pages/Components/FlexLayout";
import { convertGameStateFromSetup, Setup1, Setup2, SetupData } from "../types";

// Reusable Setup Page Components
const SetupPageLayout: FC<{ children: ReactNode; title: string }> = ({
	children,
	title,
}) => (
	<div className="min-h-screen bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-4 flex items-center justify-center relative overflow-hidden">
		{/* Background decorative elements */}
		<div className="absolute inset-0 bg-gradient-to-t from-emerald-800/20 to-transparent"></div>
		<div className="absolute top-1/3 right-0 w-72 h-72 bg-emerald-400/15 rounded-full blur-2xl"></div>
		<div className="absolute bottom-0 left-1/4 w-64 h-64 bg-teal-400/15 rounded-full blur-2xl"></div>

		<div className="max-w-md w-full relative z-10">
			<h1 className="text-3xl font-bold text-white mb-8 text-center drop-shadow-lg">
				{title}
			</h1>
			{children}
		</div>
	</div>
);

const SetupButton: FC<{
	children: ReactNode;
	size?: "sm" | "md" | "lg";
	className?: string;
	to?: string;
	params?: Record<string, unknown>;
	onClick?: () => void;
	type?: "button" | "submit";
}> = ({
	children,
	size = "md",
	className = "",
	to,
	params,
	onClick,
	type = "button",
}) => {
	const sizeClasses = {
		sm: "p-4 text-lg",
		md: "p-8 text-xl",
		lg: "p-12 text-4xl",
	}[size];

	const baseClasses = `flex-1 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm hover:from-white/30 hover:to-white/20 transition-all duration-300 font-bold text-white rounded-lg text-center shadow-lg hover:shadow-xl ${sizeClasses} ${className}`;

	if (to) {
		return (
			<Link className={baseClasses} to={to} params={params}>
				{children}
			</Link>
		);
	}

	return (
		<button type={type} className={baseClasses} onClick={onClick}>
			{children}
		</button>
	);
};

const SetupPrimaryButton: FC<{
	children: ReactNode;
	type?: "button" | "submit";
	onClick?: () => void;
}> = ({ children, type = "button", onClick }) => (
	<button
		type={type}
		onClick={onClick}
		className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-3 px-6 rounded-lg font-medium text-lg transition-all duration-300 mt-6 shadow-lg hover:shadow-xl"
	>
		{children}
	</button>
);

const SetupInput: FC<{ placeholder: string }> = ({ placeholder }) => (
	<input
		type="text"
		name="playername"
		defaultValue={placeholder}
		className="flex-1 bg-gradient-to-r from-white/25 to-white/15 backdrop-blur-sm border border-white/40 text-white text-lg rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 focus:from-white/35 focus:to-white/25 block w-full p-3 placeholder-white/70 transition-all duration-300 shadow-lg"
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
				<SetupButton
					size="lg"
					to="/setup/{-$data}"
					params={{ data: [3] }}
				>
					3
				</SetupButton>
				<SetupButton
					size="lg"
					to="/setup/{-$data}"
					params={{ data: [4] }}
				>
					4
				</SetupButton>
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
		<SetupPageLayout title="Ievadi spēlētāju vārdus">
			<form ref={formRef} onSubmit={onSubmit} className="space-y-4">
				<FlexLayout className="gap-4">
					{placeholders.map((placeholder, i) => (
						<SetupInput key={i} placeholder={placeholder} />
					))}
				</FlexLayout>
				<SetupPrimaryButton type="submit">Turpināt</SetupPrimaryButton>
			</form>
		</SetupPageLayout>
	);
};
const DealerSelectPage: FC<{ setup: Setup2 }> = ({ setup }) => {
	return (
		<SetupPageLayout title="Izvēlies sākuma dalītāju">
			<FlexLayout className="gap-4">
				{setup[1].map((name, dealer) => (
					<SetupButton
						key={dealer}
						to="/setup/{-$data}"
						params={{ data: [...setup, dealer] }}
					>
						{name}
					</SetupButton>
				))}
			</FlexLayout>
		</SetupPageLayout>
	);
};

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
