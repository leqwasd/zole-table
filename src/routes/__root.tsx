import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { FC } from "react";
import { Navbar } from "../components/Navbar";

const Component: FC = () => {
	return (
		<>
			<Navbar />
			<main className="pt-14">
				<Outlet />
			</main>
			<TanStackRouterDevtools />
		</>
	);
};

export const Route = createRootRoute({
	component: Component,
});
