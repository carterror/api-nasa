import Image from "next/image";
import Link from "next/link";

interface NasaApod {
  date: string;
  explanation: string;
  hdurl: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
}

async function getApod(): Promise<NasaApod | null> {
  const apiKeyNasa = process.env.NEXT_PUBLIC_KEY_API_NASA;
  try {
    if (!apiKeyNasa) throw new Error("NASA API key no configurada");
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${apiKeyNasa}`,
      { next: { revalidate: 3600 } },
    );
    if (!response.ok) throw new Error(`NASA API error: ${response.status}`);
    const data: NasaApod = await response.json();
    if (data.media_type === "image") return data;
    return null;
  } catch {
    return null;
  }
}

export default async function NasaPage() {
  const apod = await getApod();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 rounded-full text-purple-600 shadow-md font-semibold text-sm hover:bg-white/80 transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-2">
            🌌 Imagen del Día NASA
          </h1>
          <p className="text-gray-700 text-lg italic">
            Como el universo es infinito, así es mi amor por ti
          </p>
        </div>

        {apod ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
            <div className="relative w-full h-96 md:h-[500px]">
              <Image
                src={apod.hdurl ?? apod.url}
                alt={apod.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h2 className="text-3xl font-bold mb-2">{apod.title}</h2>
                <p className="text-sm opacity-90">{apod.date}</p>
              </div>
            </div>

            <div className="p-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed text-justify">
                  {apod.explanation}
                </p>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border-2 border-pink-200">
                <p className="text-center text-gray-800 italic text-lg">
                  "Cada día descubro algo nuevo y maravilloso en el universo, pero nada se compara con la maravilla de estar contigo. Eres mi estrella más brillante." ✨
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 text-center">
            <p className="text-gray-600 text-lg">
              No se pudo cargar la imagen del día. Vuelve a intentarlo más tarde.
            </p>
          </div>
        )}

        <div className="text-center mt-6 space-y-2">
          <p className="text-base text-gray-800 font-semibold">
            💫 Cada día una nueva maravilla del universo dedicada para ti 💫
          </p>
          <p className="text-sm text-gray-600">
            Regresa mañana para descubrir la siguiente imagen que tiene el universo para nosotros.
          </p>
          {apod && (
            <p className="text-xs text-gray-500">
              Imagen del día cortesía de NASA • {apod.date}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
