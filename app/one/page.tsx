"use client";

import { useState } from "react";

type LovePage = {
	character: string;
	loveLine: string;
	symbol: string;
	detail: string;
	accent: string;
	imagePath: string;
};

const loveBookPages: LovePage[] = [
	{
		character: "Luffy",
		loveLine: "Te amo como Luffy ama la carne",
		symbol: "🍖",
		detail: "con hambre de verte todos los dias",
		accent: "#c2410c",
		imagePath: "/one-piece/luffy.png",
	},
	{
		character: "Zoro",
		loveLine: "Te amo como Zoro ama el alcohol",
		symbol: "🍶",
		detail: "con firmeza, sin perder el rumbo de tu abrazo",
		accent: "#166534",
		imagePath: "/one-piece/zoro.png",
	},
	{
		character: "Nami",
		loveLine: "Te amo como Nami ama las mandarinas",
		symbol: "🍊",
		detail: "brillante y dulce, como tu sonrisa",
		accent: "#ea580c",
		imagePath: "/one-piece/nami.png",
	},
	{
		character: "Usopp",
		loveLine: "Te amo como Usopp ama a Kaya y al Merry",
		symbol: "⛵",
		detail: "con historias locas y fe en nosotros",
		accent: "#a16207",
		imagePath: "/one-piece/usopp.png",
	},
	{
		character: "Sanji",
		loveLine: "Te amo como Sanji ama cocinar para las minusas",
		symbol: "💃🏻",
		detail: "con detalle, sazon y puro romance",
		accent: "#ca8a04",
		imagePath: "/one-piece/sanji.png",
	},
	{
		character: "Chopper",
		loveLine: "Te amo como Chopper ama los dulces",
		symbol: "🍰",
		detail: "tiernito, suavecito y de corazon gigante",
		accent: "#0e7490",
		imagePath: "/one-piece/chopper.png",
	},
	{
		character: "Vivi",
		loveLine: "Te amo como Vivi ama a su pais",
		symbol: "🦆",
		detail: "con lealtad y fuerza cuando mas importa",
		accent: "#2563eb",
		imagePath: "/one-piece/vivi.png",
	},
	{
		character: "Robin",
		loveLine: "Te amo como Robin ama la verdad",
		symbol: "📖",
		detail: "descubriendo cada parte bonita de ti",
		accent: "#7c3aed",
		imagePath: "/one-piece/robin.png",
	},
	{
		character: "Franky",
		loveLine: "Te amo como Franky ama a Tom",
		symbol: "🐟",
		detail: "con orgullo y corazon SUPER",
		accent: "#0284c7",
		imagePath: "/one-piece/franky.png",
	},
	{
		character: "Brook",
		loveLine: "Te amo como Brook ama la musica",
		symbol: "🎼🎻",
		detail: "con ritmo, alegria y alma eterna",
		accent: "#334155",
		imagePath: "/one-piece/brook.png",
	},
	{
		character: "Jinbe",
		loveLine: "Te amo como Jinbe ama la libertad",
		symbol: "⛓️‍💥",
		detail: "profundo como el mar, libre y verdadero",
		accent: "#1d4ed8",
		imagePath: "/one-piece/jinbe.png",
	},
];

export default function OnePieceBookPage() {
	const [pageIndex, setPageIndex] = useState(0);
	const [brokenImageMap, setBrokenImageMap] = useState<Record<string, boolean>>({});

	const currentPage = loveBookPages[pageIndex];
	const isFirstPage = pageIndex === 0;
	const isLastPage = pageIndex === loveBookPages.length - 1;
	const useEmojiFallback = Boolean(brokenImageMap[currentPage.character]);

	return (
		<main className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,#fff4d6_0%,#f7e6be_40%,#e2c188_100%)] px-4 py-10 text-stone-900">
			<section className="mx-auto w-full max-w-5xl">
				<header className="mb-6 text-center">
					<p className="text-sm uppercase tracking-[0.22em] text-stone-700">One Piece Love Book</p>
					<h1 className="mt-2 text-3xl font-black md:text-5xl">Nuestro Librito Especial</h1>
					<p className="mx-auto mt-3 max-w-2xl text-sm text-stone-700 md:text-base">
						Pasa cada pagina para ver como te amo, personaje por personaje.
					</p>
				</header>

				<div className="book-shadow relative mx-auto overflow-hidden rounded-2xl border-4 border-stone-900 bg-[#fef7e8]">
					<div className="grid min-h-[520px] grid-cols-1 md:grid-cols-2">
						<aside className="paper-texture relative border-b-4 border-stone-900 p-6 md:border-b-0 md:border-r-4 md:p-10">
							<span className="inline-block rounded-full border-2 border-stone-900 bg-rose-200 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em]">
								Carta Del Corazon
							</span>
							<h2 className="mt-6 text-4xl font-black leading-[1.02] md:text-5xl">
								TU AMOR
								<br />
								<span className="text-3xl md:text-4xl">no se busca</span>
							</h2>
							<p className="mt-4 max-w-md text-lg leading-snug text-stone-700">
								porque ya encontre el tesoro que quiero cuidar todos los dias.
							</p>

							<div className="mt-8 rounded-xl border-2 border-dashed border-stone-900 bg-white/70 p-4">
								<p className="text-xs uppercase tracking-[0.15em] text-stone-600">Indice del viaje</p>
								<p className="mt-2 text-sm font-semibold">
									Pagina {pageIndex + 1} de {loveBookPages.length}
								</p>
								<p className="text-sm text-stone-700">Siguiente parada: {currentPage.character}</p>
							</div>
						</aside>

						<article
							key={currentPage.character}
							className="paper-texture page-flip relative flex flex-col justify-between p-6 md:p-10"
						>
							<div>
								<span className="inline-block rounded-full border-2 border-stone-900 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.12em]">
									Personaje {pageIndex + 1}
								</span>
								<h3 className="mt-5 text-3xl font-black leading-tight md:text-4xl">{currentPage.character}</h3>
								<p className="mt-4 text-xl font-extrabold md:text-2xl" style={{ color: currentPage.accent }}>
									{currentPage.loveLine}
								</p>
								<p className="mt-4 text-base text-stone-700 md:text-lg">{currentPage.detail}</p>
							</div>

							<div className="mt-8 rounded-2xl border-2 border-stone-900 bg-white/85 p-5 text-center">
								{useEmojiFallback ? (
									<p className="text-5xl md:text-6xl">{currentPage.symbol}</p>
								) : (
									<img
										src={currentPage.imagePath}
										alt={currentPage.character}
										className="mx-auto h-36 w-36 rounded-xl border-2 border-stone-900 object-cover md:h-44 md:w-44"
										onError={() => {
											setBrokenImageMap((prev) => ({ ...prev, [currentPage.character]: true }));
										}}
									/>
								)}
								<p className="mt-3 text-xs uppercase tracking-[0.14em] text-stone-500">Sello de amor pirata</p>
							</div>
						</article>
					</div>
				</div>

				<div className="mt-6 flex flex-wrap items-center justify-center gap-3">
					<button
						type="button"
						onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
						disabled={isFirstPage}
						className="rounded-full border-2 border-stone-900 bg-white px-5 py-2 text-sm font-bold uppercase tracking-[0.1em] shadow-[3px_3px_0_0_#292524] transition hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0_0_#292524] disabled:cursor-not-allowed disabled:opacity-50"
					>
						Anterior
					</button>

					<button
						type="button"
						onClick={() => setPageIndex((prev) => Math.min(prev + 1, loveBookPages.length - 1))}
						disabled={isLastPage}
						className="rounded-full border-2 border-stone-900 bg-rose-300 px-5 py-2 text-sm font-bold uppercase tracking-[0.1em] shadow-[3px_3px_0_0_#292524] transition hover:translate-x-[1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0_0_#292524] disabled:cursor-not-allowed disabled:opacity-50"
					>
						Siguiente
					</button>
				</div>

				<div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-2 px-2">
					{loveBookPages.map((page, index) => (
						<button
							key={page.character}
							type="button"
							aria-label={`Ir a la pagina de ${page.character}`}
							onClick={() => setPageIndex(index)}
							className="h-2.5 rounded-full border border-stone-700 transition-all"
							style={{
								width: pageIndex === index ? "2.2rem" : "0.75rem",
								backgroundColor: pageIndex === index ? "#292524" : "#fff",
							}}
						/>
					))}
				</div>
			</section>

			<style jsx>{`
				.book-shadow {
					box-shadow: 0 16px 0 #292524, 0 30px 40px rgba(28, 25, 23, 0.3);
				}

				.paper-texture {
					background-image: linear-gradient(rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.72)),
						repeating-linear-gradient(45deg, rgba(120, 113, 108, 0.06) 0 2px, transparent 2px 7px);
				}

				.page-flip {
					transform-origin: left center;
					animation: flip-in 460ms ease;
				}

				@keyframes flip-in {
					0% {
						opacity: 0;
						transform: perspective(1200px) rotateY(-24deg) translateX(24px);
					}
					100% {
						opacity: 1;
						transform: perspective(1200px) rotateY(0deg) translateX(0);
					}
				}
			`}</style>
		</main>
	);
}
