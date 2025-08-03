import { createFileRoute, Link } from "@tanstack/react-router";
import { FC, ReactNode } from "react";

// Reusable Home Page Components
const HomePageLayout: FC<{ children: ReactNode }> = ({ children }) => (
	<div className="min-h-screen bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-4 flex items-center justify-center relative overflow-hidden">
		{/* Background decorative elements */}
		<div className="absolute inset-0 bg-gradient-to-t from-emerald-800/30 to-transparent"></div>
		<div className="absolute top-1/4 -right-32 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"></div>
		<div className="absolute bottom-1/4 -left-32 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl"></div>
		<div className="text-center relative z-10">{children}</div>
	</div>
);

const HomePrimaryButton: FC<{
	children: ReactNode;
	to: string;
	params?: Record<string, unknown>;
}> = ({ children, to, params }) => (
	<Link
		to={to}
		params={params}
		className="inline-block bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-4 px-8 rounded-lg font-semibold text-xl transition-all duration-300 shadow-lg hover:shadow-xl"
	>
		{children}
	</Link>
);

const Index: FC = () => {
	return (
		<HomePageLayout>
			<h1 className="text-4xl font-bold text-white mb-8 drop-shadow-lg">
				Zole Calculator
			</h1>
			<p className="text-emerald-100 text-lg mb-8">
				Seko līdzi zoles spēles rezultātiem
			</p>
			<HomePrimaryButton
				to="/setup/{-$data}"
				params={{ data: undefined }}
			>
				Jauna spēle
			</HomePrimaryButton>
		</HomePageLayout>
	);
};

export const Route = createFileRoute("/")({
	component: Index,
});
