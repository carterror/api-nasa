import type { Metadata } from "next";
import { Cormorant_Garamond, Great_Vibes } from "next/font/google";
import Link from "next/link";
import CommentsModal from "./comments-modal";
import PlaylistModal from "./playlist-modal";
import RsvpModal from "./rsvp-modal";
import WeddingCountdown from "./wedding-countdown";

const titleFont = Great_Vibes({
	subsets: ["latin"],
	weight: ["400"],
});

const bodyFont = Cormorant_Garamond({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: "Invitación de boda | Carlos y Ana",
	description: "Celebremos juntos nuestra boda. Carlos y Ana.",
};

const eventDetails = [
	{
		label: "Ceremonia",
		value: "1:00 p. m. | Mariano Pinto Urbanización Ontaneda Lote 111 Conocoto, Quito",
		href: "https://maps.app.goo.gl/kkwWFNcBVHF2Zrwy7",
	},
	{
		label: "Recepción",
		value: "2:00 p. m. | Mariano Pinto Urbanización Ontaneda Lote 111 Conocoto, Quito",
		href: "https://maps.app.goo.gl/kkwWFNcBVHF2Zrwy7",
	},
	{
		label: "Código de vestimenta",
		value: "Formal elegante en tonos oscuros y neutros",
	},
	{
		label: "Confirmación",
		value: "Antes del 1 de junio",
	},
];

export default function BodaPage() {

	return (
		<main
			className={`${bodyFont.className} relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_0%,_#ffffff_0%,_#fdf4f5_30%,_#faeaeb_58%,_#F8DBDD_100%)] px-6 py-10 text-[#00345B] md:px-10`}
		>
			<div className="pointer-events-none absolute -top-28 -left-20 h-72 w-72 rounded-full bg-[#ffffff]/80 blur-3xl" />
			<div className="pointer-events-none absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-[#F8DBDD]/60 blur-3xl" />

			<div className="relative mx-auto flex w-full max-w-4xl flex-col gap-8 rounded-[2rem] border border-white/85 bg-white/78 p-6 shadow-[0_20px_60px_rgba(18,54,99,0.18)] backdrop-blur-sm md:p-10">
				<header className="text-center">
					<p className="mb-2 text-sm tracking-[0.35em] text-[#005a8e] uppercase">
						Tenemos una noticia hermosa
					</p>
					<h1 className={`${titleFont.className} text-6xl leading-tight text-[#00345B] md:text-8xl`}>
						Carlos &amp; Ana
					</h1>
					<p className="mx-auto mt-3 max-w-2xl text-lg leading-relaxed text-[#004d7a] md:text-2xl">
						Para el amor de mi vida. Como el universo es infinito, así es nuestro
						amor. Nos casamos y queremos celebrarlo contigo.
					</p>
				</header>

				<section className="rounded-3xl border border-[#F8DBDD]/80 bg-gradient-to-b from-white to-[#fff5f6] p-6 text-center shadow-inner md:p-8">
					<p className="text-base tracking-[0.25em] text-[#005a8e] uppercase">Sabado</p>
					<p className="mt-2 text-5xl font-semibold text-[#00345B] md:text-6xl">1</p>
					<p className="text-2xl font-medium text-[#005a8e] md:text-3xl">agosto 2026</p>
					<p className="mt-4 text-lg">Comienza a las 12:00 p. m.</p>
				</section>

				<WeddingCountdown />

				<section className="grid gap-4 md:grid-cols-2">
					{eventDetails.map((item) => (
						<article
							key={item.label}
							className="rounded-2xl border border-[#F8DBDD]/80 bg-[#fff5f6] p-5 shadow-[0_8px_26px_rgba(0,52,91,0.09)]"
						>
							<h2 className="text-xs tracking-[0.25em] text-[#005a8e] uppercase">
								{item.label}
							</h2>
						{item.href ? (
							<a
								href={item.href}
								target="_blank"
								rel="noopener noreferrer"
								className="mt-2 inline-block text-xl font-semibold text-[#00345B] underline decoration-[#F8DBDD] underline-offset-4 hover:text-[#005a8e]"
							>
								{item.value}
							</a>
						) : (
							<p className="mt-2 text-xl font-semibold text-[#00345B]">{item.value}</p>
						)}
						</article>
					))}
				</section>

				<section className="rounded-3xl border border-[#F8DBDD]/80 bg-white/85 p-6 text-center md:p-8">
					<p className="text-xs tracking-[0.25em] text-[#005a8e] uppercase">Confirmacion</p>
					<h2 className="mt-2 text-3xl font-semibold text-[#00345B] md:text-4xl">
						Confirma tu asistencia
					</h2>
					<p className="mx-auto mt-3 max-w-2xl text-base text-[#004d7a] md:text-lg">
						Solo podrán confirmar las personas incluidas en la lista de invitados.
					</p>
					<RsvpModal />
				</section>

				<section className="rounded-3xl border border-[#F8DBDD]/80 bg-white/85 p-6 text-center md:p-8">
					<p className="text-xs tracking-[0.25em] text-[#005a8e] uppercase">Playlist</p>
					<h2 className="mt-2 text-3xl font-semibold text-[#00345B] md:text-4xl">
						La canción que no puede faltar
					</h2>
					<p className="mx-auto mt-3 max-w-2xl text-base text-[#004d7a] md:text-lg">
						Ayúdanos a crear la playlist perfecta. ¿Cuál es esa canción que no puede faltar en nuestra boda?
					</p>
					<PlaylistModal />
				</section>

				<section className="rounded-3xl border border-[#F8DBDD]/80 bg-white/85 p-6 text-center md:p-8">
					<p className="text-xs tracking-[0.25em] text-[#005a8e] uppercase">Dedicatorias</p>
					<h2 className="mt-2 text-3xl font-semibold text-[#00345B] md:text-4xl">
						Te leemos con mucho amor
					</h2>
					<p className="mx-auto mt-3 max-w-2xl text-base text-[#004d7a] md:text-lg">
						Si quieres dejarnos unas palabras, abre el modal y comparte tu mensaje.
					</p>
					<CommentsModal />
				</section>

				<section className="rounded-3xl border border-dashed border-[#F8DBDD] bg-[#fff5f6]/90 p-6 text-center md:p-8">
					<p className="text-xl md:text-2xl">
						Tu presencia es nuestro mejor regalo.
					</p>
					<p className="mt-2 text-base leading-relaxed text-[#004d7a] md:text-lg">
						Si deseas tener un detalle con nosotros, tendremos una mesa de sobres
						el dia del evento.
					</p>
				</section>

				<section className="rounded-3xl border border-[#F8DBDD]/80 bg-white/85 p-6 text-center md:p-8">
					<p className="text-xs tracking-[0.25em] text-[#005a8e] uppercase">Album colaborativo</p>
					<h2 className="mt-2 text-3xl font-semibold text-[#00345B] md:text-4xl">
						Sube y mira todas las fotos de la boda
					</h2>
					<p className="mx-auto mt-3 max-w-2xl text-base text-[#004d7a] md:text-lg">
						Creamos una pagina especial para que todos compartan sus mejores recuerdos.
					</p>
					<Link
						href="/boda/fotos"
						className="mt-5 inline-block rounded-xl bg-[#00345B] px-6 py-3 text-lg font-semibold text-white transition hover:brightness-110"
					>
						Ir a la galeria de invitados
					</Link>
				</section>
			</div>
		</main>
	);
}

