import { FC } from "react";

export const HamburgerButton: FC<{ isOpen: boolean; onClick: () => void }> = ({
	isOpen,
	onClick,
}) => {
	return (
		<button
			onClick={onClick}
			className="flex h-8 w-8 flex-col items-center justify-center rounded border border-white/30 text-white focus:outline-none"
			aria-label="Toggle menu"
		>
			<span
				className={`block h-0.5 w-6 rounded-sm bg-white transition-all duration-300 ease-out ${
					isOpen ? "translate-y-1 rotate-45" : "-translate-y-0.5"
				}`}
			></span>
			<span
				className={`my-0.5 block h-0.5 w-6 rounded-sm bg-white transition-all duration-300 ease-out ${
					isOpen ? "opacity-0" : "opacity-100"
				}`}
			></span>
			<span
				className={`block h-0.5 w-6 rounded-sm bg-white transition-all duration-300 ease-out ${
					isOpen ? "-translate-y-1 -rotate-45" : "translate-y-0.5"
				}`}
			></span>
		</button>
	);
};
