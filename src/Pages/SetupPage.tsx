import {
	Dispatch,
	FC,
	FormEventHandler,
	SetStateAction,
	useCallback,
	useMemo,
	useRef,
	useState,
} from "react";
import { useAppDispatch } from "../AppContext/effects/useAppDispatch";
import { PlayerCount } from "../AppContext/AppContext";
import { FlexLayout } from "./Components/FlexLayout";

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
			<PlayerCountSelectButton
				count={3}
				setPlayerCount={setPlayerCount}
			/>
			<PlayerCountSelectButton
				count={4}
				setPlayerCount={setPlayerCount}
			/>
		</FlexLayout>
	);
};

const PlayerCountSelectButton: FC<{
	count: PlayerCount;
	setPlayerCount: Dispatch<SetStateAction<PlayerCount | null>>;
}> = ({ count, setPlayerCount }) => {
	const onClick = useCallback(() => {
		setPlayerCount(count);
	}, [count, setPlayerCount]);
	return (
		<button onClick={onClick} className="flex-1 p-10 text-3xl">
			{count}
		</button>
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
		[playerCount]
	);
	const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
		(e) => {
			e.preventDefault();
			// input.setValidity
			dispatch({
				type: "setup",
				players: Array.from(
					new FormData(formRef.current!).values()
				) as string[],
			});
		},
		[dispatch]
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
