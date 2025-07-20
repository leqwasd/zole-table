import { FC, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
export const FlexLayout: FC<PropsWithChildren<{ className?: string }>> = ({
	children,
	className,
}) => (
	<div
		className={twMerge("flex flex-col landscape:flex-row gap-2", className)}
	>
		{children}
	</div>
);
