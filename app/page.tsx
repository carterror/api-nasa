import Link from "next/link";
import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { collectRows, getQueryErrorMessage, runD1Query } from "./api/_lib/d1";
import { getInvitedGuests } from "./boda/invited-guests";
import HomeSummaryPanel from "./home-summary-panel";

interface WeddingSummary {
  invitedGuests: number;
  rsvpTotal: number;
  attendingTotal: number;
  declinedTotal: number;
  companionTotal: number;
  commentsTotal: number;
  photosTotal: number | null;
}

function toNumber(value: unknown): number {
  const numeric = Number(value ?? 0);
  return Number.isFinite(numeric) ? numeric : 0;
}

function getBucketName(): string | undefined {
  return process.env.AWS_S3_BUCKET ?? process.env.S3_BUCKET ?? process.env.R2_BUCKET_NAME;
}

function getS3Client(): S3Client {
  const accountId = process.env.R2_ACCOUNT_ID;
  const endpoint =
    process.env.S3_ENDPOINT_URL ??
    process.env.R2_ENDPOINT_URL ??
    (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined);
  const region = process.env.AWS_REGION ?? process.env.S3_REGION ?? "auto";
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID ?? process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey =
    process.env.AWS_SECRET_ACCESS_KEY ?? process.env.R2_SECRET_ACCESS_KEY;

  if ((accessKeyId && !secretAccessKey) || (!accessKeyId && secretAccessKey)) {
    throw new Error("Debes configurar ambas credenciales: ACCESS_KEY y SECRET_ACCESS_KEY.");
  }

  return new S3Client({
    region,
    endpoint,
    credentials: accessKeyId && secretAccessKey ? { accessKeyId, secretAccessKey } : undefined,
  });
}

async function getPhotosTotal(): Promise<number | null> {
  try {
    const bucket = getBucketName();
    if (!bucket) {
      return null;
    }

    const client = getS3Client();
    const result = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: "wedding-photos/",
        MaxKeys: 1000,
      }),
    );

    return (result.Contents ?? []).filter((item) => Boolean(item.Key)).length;
  } catch {
    return null;
  }
}

async function getWeddingSummary(): Promise<WeddingSummary> {
  const invitedGuests = getInvitedGuests().length;

  const [rsvpSummary, commentsSummary, photosTotal] = await Promise.all([
    (async () => {
      try {
        const chunks = await runD1Query(
          "SELECT COUNT(*) AS total, SUM(CASE WHEN attending = 1 THEN 1 ELSE 0 END) AS attending_total, SUM(CASE WHEN attending = 0 THEN 1 ELSE 0 END) AS declined_total, SUM(CASE WHEN attending = 1 THEN guests_count ELSE 0 END) AS companion_total FROM wedding_rsvp;",
        );
        const queryError = getQueryErrorMessage(chunks);
        if (queryError) {
          return {
            rsvpTotal: 0,
            attendingTotal: 0,
            declinedTotal: 0,
            companionTotal: 0,
          };
        }

        const row = collectRows(chunks)[0] ?? {};
        return {
          rsvpTotal: toNumber(row.total),
          attendingTotal: toNumber(row.attending_total),
          declinedTotal: toNumber(row.declined_total),
          companionTotal: toNumber(row.companion_total),
        };
      } catch {
        return {
          rsvpTotal: 0,
          attendingTotal: 0,
          declinedTotal: 0,
          companionTotal: 0,
        };
      }
    })(),
    (async () => {
      try {
        const chunks = await runD1Query("SELECT COUNT(*) AS total FROM wedding_comments;");
        const queryError = getQueryErrorMessage(chunks);
        if (queryError) {
          return 0;
        }

        const row = collectRows(chunks)[0] ?? {};
        return toNumber(row.total);
      } catch {
        return 0;
      }
    })(),
    getPhotosTotal(),
  ]);

  return {
    invitedGuests,
    rsvpTotal: rsvpSummary.rsvpTotal,
    attendingTotal: rsvpSummary.attendingTotal,
    declinedTotal: rsvpSummary.declinedTotal,
    companionTotal: rsvpSummary.companionTotal,
    commentsTotal: commentsSummary,
    photosTotal,
  };
}

export default async function Home() {
  const summary = await getWeddingSummary();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8 animate-fade-in">
          <div className="mb-4">
            <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-2">
              Carlos & Ana
            </h1>
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

        <HomeSummaryPanel summary={summary} />
        
        {/* Custom Song Player */}
        <div className="mb-8 bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 rounded-3xl p-6 shadow-2xl border-4 border-white/50">
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 mb-2">
              🎵 Una Canción Especial Para Ti 🎵
            </h3>
            <p className="text-gray-700 font-medium">
              Compuesta con todo mi amor, desde mi corazón al tuyo
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg">
            <audio 
              controls
              autoPlay
              loop
              className="w-full"
              style={{
                filter: 'hue-rotate(280deg) saturate(1.5)',
                height: '54px'
              }}
            >
              <source src="/music.wav" type="audio/wav" />
              Tu navegador no soporta el reproductor de audio.
            </audio>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 italic">
                💝 Creada especialmente para Ana, mi amor infinito 💝
              </p>
            </div>
          </div>
                  <div className="mt-8 mb-8">
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

       

        {/* Pedida de Matrimonio */}
        <div className="mb-8 bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 rounded-3xl p-6 shadow-2xl border-4 border-white/50">
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 mb-2">
              💍 Nuestra Pedida de Matrimonio 💍
            </h3>
            <p className="text-gray-700 font-medium">
              El momento más especial de nuestras vidas
            </p>
          </div>
          <div className="flex flex-col gap-6 overflow-y-auto rounded-2xl" style={{ height: '750px' }}>
            <iframe
              src="https://www.tiktok.com/embed/v2/7608984408233692434"
              className="rounded-2xl shadow-lg w-full flex-shrink-0"
              style={{ height: '100%', border: 'none' }}
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            ></iframe>
            <iframe
              src="https://www.instagram.com/p/DU6ME6miYWi/embed/"
              className="rounded-2xl shadow-lg w-full flex-shrink-0"
              style={{ height: '100%', border: 'none' }}
              allowFullScreen
              loading="lazy"
            ></iframe>
            <iframe
              src="https://www.instagram.com/p/DU3ZJzMETx2/embed/"
              className="rounded-2xl shadow-lg w-full flex-shrink-0"
              style={{ height: '100%', border: 'none' }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            href="/nasa"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            🌌 Ver imagen del día de la NASA
          </Link>
        </div>
      </div>
    </div>
  );
}
