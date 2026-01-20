import Image from "next/image";

interface NasaApod {
  date: string;
  explanation: string;
  hdurl: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
}

export default async function Home() {
  const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=pNTVFS4fuz45l4bpcHRF1ZCAVomhliKLd8X7cqAR');
  const apod: NasaApod = await response.json();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8 animate-fade-in">
          <div className="mb-4">
            <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-2">
              CarAna
            </h1>
            <p className="text-pink-400 text-sm tracking-widest">Carlos & Ana</p>
          </div>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-4">
            Para el Amor de Mi Vida 💕
          </h2>
          <p className="text-gray-700 text-lg italic mb-3">
            Como el universo es infinito, así es mi amor por ti
          </p>
          <div className="flex justify-center gap-4 text-sm font-semibold">
            <span className="px-4 py-2 bg-white/60 rounded-full text-purple-600 shadow-md">
              I see you 👁️
            </span>
            <span className="px-4 py-2 bg-white/60 rounded-full text-pink-600 shadow-md">
              All for you 💝
            </span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
          <div className="relative w-full h-96 md:h-[500px]">
            <Image
              src={apod.hdurl}
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

            <div className="mt-8">
              <h3 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-4">
                Nuestra Música 🎵
              </h3>
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <iframe 
                  data-testid="embed-iframe" 
                  style={{borderRadius: '12px'}} 
                  src="https://open.spotify.com/embed/playlist/0tbbciiqCUZciVTS3LdMvE?utm_source=generator" 
                  width="100%" 
                  height="352" 
                  frameBorder="0" 
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Imagen del día cortesía de NASA • {apod.date}
          </p>
        </div>
      </div>
    </div>
  );
}
