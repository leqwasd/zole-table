import { FC, useCallback } from "react";
import { useAppDispatch } from "../../AppContext/effects/useAppDispatch";
import { useAppState } from "../../AppContext/effects/useAppState";
import { FlexLayout } from "./FlexLayout";

export const DealerSelect: FC = () => {
	const { players } = useAppState();
	return (
		<div>
			<div>Izvēlieties dalītāju:</div>
			<FlexLayout>
				{players.map((name, index) => (
					<DealerSelectButton key={index} name={name} index={index} />
				))}
			</FlexLayout>
		</div>
	);
};

const DealerSelectButton: FC<{ name: string; index: number }> = ({
	name,
	index,
}) => {
	const dispatch = useAppDispatch();
	const onClick = useCallback(() => {
		dispatch({ type: "select_dealer", dealer: index });
	}, [dispatch, index]);
	return (
		<button
			type="button"
			onClick={onClick}
			className="flex-1 p-11 border-amber-100 text-3xl"
		>
			{name}
		</button>
	);
};
