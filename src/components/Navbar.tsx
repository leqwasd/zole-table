import { FC, useEffect, useRef, useState } from "react";

export const Navbar: FC = () => {
	const pageYOffset = useRef(window.pageYOffset);
	const [className, setClassName] = useState("top-0");

	useEffect(() => {
		function cb() {
			const currentPageYOffset = window.pageYOffset;
			if (currentPageYOffset > 200) {
				if (pageYOffset.current > currentPageYOffset) {
					setClassName("top-0");
				} else {
					setClassName("-top-14");
				}
			}
			pageYOffset.current = currentPageYOffset;
		}
		window.addEventListener("scroll", cb);
		return () => window.removeEventListener("scroll", cb);
	}, []);
	return (
		<nav
			className={`fixed z-10 h-14 w-full bg-green-400 transition-[top] ${className}`}
		>
			ASD
		</nav>
	);
};
