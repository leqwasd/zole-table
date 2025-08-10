import { FC, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { HamburgerButton } from "./HamburgerButton";

export const Navbar: FC = () => {
	const pageYOffset = useRef(window.pageYOffset);
	const [className, setClassName] = useState("top-0");
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const location = useLocation();

	useEffect(() => {
		function cb() {
			const currentPageYOffset = window.pageYOffset;
			if (currentPageYOffset > 200) {
				if (pageYOffset.current > currentPageYOffset) {
					setClassName("top-0");
				} else {
					setClassName("-top-14");
					setIsMenuOpen(false); // Close menu when navbar hides
				}
			}
			pageYOffset.current = currentPageYOffset;
		}
		window.addEventListener("scroll", cb);
		return () => window.removeEventListener("scroll", cb);
	}, []);

	// Close menu when route changes
	useEffect(() => {
		setIsMenuOpen(false);
	}, [location.pathname]);

	const navItems = [
		{ to: "/", label: "Sākums" },
		{ to: "/new", label: "Jauna spēle" },
		{ to: "/history", label: "Vēsture" },
	];

	return (
		<>
			<nav
				className={`fixed z-20 h-14 w-full border-b border-white/10 bg-gradient-to-r from-emerald-600/90 via-emerald-700/90 to-teal-700/90 shadow-lg backdrop-blur-sm transition-[top] ${className}`}
			>
				<div className="flex h-full items-center justify-between px-4">
					<Link
						to="/"
						className="text-lg font-bold text-white transition-colors hover:text-emerald-100"
					>
						Zolītes punktu tabula
					</Link>
					<HamburgerButton
						isOpen={isMenuOpen}
						onClick={() => setIsMenuOpen((prev) => !prev)}
					/>
				</div>
			</nav>

			{/* Mobile Menu Overlay */}
			<div
				className={`fixed inset-0 z-10 bg-gradient-to-br from-emerald-900/60 via-emerald-800/60 to-teal-900/60 backdrop-blur-xs transition-opacity duration-300 ${
					isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
				}`}
				onClick={() => setIsMenuOpen(false)}
			/>

			{/* Mobile Menu */}
			<div
				className={`fixed top-14 right-0 z-15 w-64 transform border-l border-white/10 bg-gradient-to-br from-emerald-600/95 via-emerald-700/95 to-teal-700/95 shadow-xl backdrop-blur-md transition-transform duration-300 ${
					isMenuOpen ? "translate-x-0" : "translate-x-full"
				}`}
			>
				<div className="py-2">
					{navItems.map((item) => (
						<Link
							key={item.to}
							to={item.to}
							className={`block px-6 py-3 text-white transition-all duration-200 hover:bg-gradient-to-r hover:from-white/20 hover:to-white/10 ${
								location.pathname === item.to
									? "border-r-2 border-emerald-200 bg-gradient-to-r from-white/25 to-white/15 font-semibold"
									: ""
							}`}
						>
							{item.label}
						</Link>
					))}
				</div>
			</div>
		</>
	);
};
