import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import GalleryView from "./gallery-view";

const bodyFont = Cormorant_Garamond({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: "Galeria de boda | Carlos y Ana",
	description: "Sube y mira las fotos compartidas por nuestros invitados.",
};

export default function BodaFotosPage() {
	return (
		<main
			className={`${bodyFont.className} min-h-screen bg-[radial-gradient(circle_at_top,_#ffe6f4_0%,_#f4ddff_40%,_#d4c8ff_72%,_#bcd6ff_100%)] px-6 py-10 text-[#32214b] md:px-10`}
		>
			<GalleryView />
		</main>
	);
}
