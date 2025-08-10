import { FC } from "react";

export const Overlay: FC<{ onClick: () => void; visible: boolean }> = ({
	onClick,
	visible,
}) => (
	<div
		className={`fixed inset-0 z-10 bg-gradient-to-br from-emerald-900/60 via-emerald-800/60 to-teal-900/60 backdrop-blur-xs ${
			visible ? "animate-appear" : "animate-vanish hidden"
		}`}
		onClick={onClick}
	/>
);
