import {
	Dispatch,
	FC,
	FormEventHandler,
	SetStateAction,
	useCallback,
	useMemo,
	useRef,
	useState,
	ReactNode,
} from "react";
import { useAppDispatch } from "../AppContext/effects/useAppDispatch";
import { PlayerCount } from "../AppContext/AppContext";
import { FlexLayout } from "./Components/FlexLayout";

// Reusable button component for setup pages
const PrimaryButton: FC<{
	children: ReactNode;
	onClick?: () => void;
	type?: "button" | "submit";
	size?: "sm" | "md" | "lg";
	className?: string;
}> = ({ children, onClick, type = "button", size = "md", className = "" }) => {
	const sizeClasses = {
		sm: "px-4 py-2 text-sm",
		md: "px-5 py-2.5 text-sm",
		lg: "px-8 py-4 text-lg",
	}[size];

	return (
		<button
			type={type}
			onClick={onClick}
			className={`bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl ${sizeClasses} ${className}`}
		>
			{children}
		</button>
	);
};

const PlayerCountSelectButton: FC<{
	children: ReactNode;
	onClick: () => void;
}> = ({ children, onClick }) => (
	<button
		onClick={onClick}
		className="flex-1 p-10 text-3xl bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 hover:from-white/25 hover:to-white/10 transition-all duration-300 text-white font-semibold hover:shadow-xl"
	>
		{children}
	</button>
);

export const SetupPage: FC = () => {
	const [playerCount, setPlayerCount] = useState<PlayerCount | null>(null);

	if (playerCount == null) {
		return <PlayerCountSelectButtons setPlayerCount={setPlayerCount} />;
	}
	return <PlayerNamesInputs playerCount={playerCount} />;
};

const PlayerCountSelectButtons: FC<{
	setPlayerCount: Dispatch<SetStateAction<PlayerCount | null>>;
}> = ({ setPlayerCount }) => {
	return (
		<FlexLayout>
			<PlayerCountSelectButton onClick={() => setPlayerCount(3)}>
				3
			</PlayerCountSelectButton>
			<PlayerCountSelectButton onClick={() => setPlayerCount(4)}>
				4
			</PlayerCountSelectButton>
		</FlexLayout>
	);
};

const PlayerNamesInputs: FC<{
	playerCount: PlayerCount;
}> = ({ playerCount }) => {
	const dispatch = useAppDispatch();
	const formRef = useRef<HTMLFormElement>(null);
	const placeholders = useMemo(
		() =>
			new Array(playerCount)
				.fill("")
				.map((_, i) => `${i + 1}. spēlētājs`),
		[playerCount],
	);
	const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
		(e) => {
			e.preventDefault();
			// input.setValidity
			dispatch({
				type: "setup",
				players: Array.from(
					new FormData(formRef.current!).values(),
				) as string[],
			});
		},
		[dispatch],
	);
	return (
		<form ref={formRef} onSubmit={onSubmit} className="space-y-6">
			<FlexLayout>
				{placeholders.map((placeholder, i) => (
					<PlayerNameInput key={i} placeholder={placeholder} />
				))}
			</FlexLayout>
			<div className="flex justify-center">
				<PrimaryButton
					type="submit"
					size="lg"
					className="w-full max-w-xs"
				>
					Sākt spēli
				</PrimaryButton>
			</div>
		</form>
	);
};
const PlayerNameInput: FC<{ placeholder: string }> = ({ placeholder }) => (
	<input
		type="text"
		name="playername"
		defaultValue={placeholder}
		className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 block w-full p-3 placeholder-white/60 transition-all duration-300"
		required
		placeholder={placeholder}
	/>
);
