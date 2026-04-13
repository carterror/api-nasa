import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import Link from "next/link";
import GalleryView from "./gallery-view";

const bodyFont = Cormorant_Garamond({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
	alternates: {
		canonical: "https://love.carana26.com/boda/fotos",
	},
	title: "Galeria de boda | Carlos y Ana",
	description: "Sube y mira las fotos compartidas por nuestros invitados.",
};

export default function BodaFotosPage() {
	return (
		<main
			className={`${bodyFont.className} min-h-screen bg-[radial-gradient(circle_at_20%_0%,_#ffffff_0%,_#fdf4f5_30%,_#faeaeb_58%,_#F8DBDD_100%)] px-6 py-10 text-[#00345B] md:px-10`}
		>
			<Link
				href="/boda"
				className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00345B]/20 px-4 py-2 text-sm font-medium text-[#00345B] transition hover:bg-[#00345B]/10"
			>
				← Volver a la boda
			</Link>
			<GalleryView />
		</main>
	);
}
