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
			className={`${bodyFont.className} min-h-screen bg-[radial-gradient(circle_at_20%_0%,_#ffffff_0%,_#eaf4ff_30%,_#dbeeff_58%,_#c5e2ff_100%)] px-6 py-10 text-[#11315b] md:px-10`}
		>
			<GalleryView />
		</main>
	);
}
