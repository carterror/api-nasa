"use client";

import { useMemo, useState } from "react";

interface WeddingSummary {
  rsvpTotal: number;
  attendingTotal: number;
  declinedTotal: number;
  companionTotal: number;
  commentsTotal: number;
  photosTotal: number | null;
}

interface RsvpItem {
  id: string | number;
  name: string;
  attending: boolean;
  guestsCount: number;
  message?: string;
  createdAt?: string;
}

interface CommentItem {
  id: string | number;
  name: string;
  comment: string;
  createdAt?: string;
}

interface RsvpResponse {
  confirmations?: RsvpItem[];
  error?: string;
}

interface CommentsResponse {
  comments?: CommentItem[];
  error?: string;
}

interface HomeSummaryPanelProps {
  summary: WeddingSummary;
}

type ModalType = "attending" | "comments" | null;

function formatDate(value?: string): string {
  if (!value) {
    return "Fecha no disponible";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString("es-EC", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function HomeSummaryPanel({ summary }: HomeSummaryPanelProps) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attendingList, setAttendingList] = useState<RsvpItem[]>([]);
  const [commentsList, setCommentsList] = useState<CommentItem[]>([]);

  const summaryCards = useMemo(
    () => [
      { label: "RSVP registrados", value: summary.rsvpTotal },
      {
        label: "Asistiran",
        value: summary.attendingTotal,
        detailType: "attending" as const,
        detailLabel: "Ver personas",
      },
      { label: "No asistiran", value: summary.declinedTotal },
      { label: "Acompanantes", value: summary.companionTotal },
      {
        label: "Comentarios",
        value: summary.commentsTotal,
        detailType: "comments" as const,
        detailLabel: "Ver comentarios",
      },
      {
        label: "Fotos compartidas",
        value: summary.photosTotal === null ? "No disponible" : summary.photosTotal,
      },
    ],
    [summary],
  );

  async function openModal(type: Exclude<ModalType, null>) {
    setActiveModal(type);
    setError("");

    if (type === "attending" && attendingList.length > 0) {
      return;
    }

    if (type === "comments" && commentsList.length > 0) {
      return;
    }

    setLoading(true);

    try {
      if (type === "attending") {
        const response = await fetch("/api/wedding-rsvp", { method: "GET" });
        const data: RsvpResponse = await response.json();
        if (!response.ok) {
          throw new Error(data.error ?? "No se pudo cargar el detalle de asistentes.");
        }

        const attending = (data.confirmations ?? []).filter((item) => item.attending);
        setAttendingList(attending);
      }

      if (type === "comments") {
        const response = await fetch("/api/wedding-comments", { method: "GET" });
        const data: CommentsResponse = await response.json();
        if (!response.ok) {
          throw new Error(data.error ?? "No se pudo cargar el detalle de comentarios.");
        }

        setCommentsList(data.comments ?? []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar el detalle.");
    } finally {
      setLoading(false);
    }
  }

  function closeModal() {
    setActiveModal(null);
    setError("");
  }

  return (
    <>
      <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/60">
        <div className="text-center">
          <p className="text-xs tracking-[0.25em] text-purple-600 uppercase">Resumen privado</p>
          <h3 className="mt-2 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
            Estado de invitados y contenido
          </h3>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((item) => (
            <article
              key={item.label}
              className="rounded-2xl border border-purple-100 bg-white/80 p-4 text-center"
            >
              <p className="text-xs tracking-[0.15em] text-purple-600 uppercase">{item.label}</p>
              <p className="mt-2 text-3xl font-bold text-gray-800">{item.value}</p>
              {item.detailType ? (
                <button
                  type="button"
                  onClick={() => openModal(item.detailType)}
                  className="mt-3 rounded-xl border border-purple-200 px-3 py-1 text-sm font-semibold text-purple-700 transition hover:bg-purple-50"
                >
                  {item.detailLabel}
                </button>
              ) : null}
            </article>
          ))}
        </div>
      </div>

      {activeModal === "attending" ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
          onClick={closeModal}
        >
          <div
            className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-2xl font-bold text-gray-800">Personas que asistiran</h4>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg border border-gray-200 px-3 py-1 text-sm"
              >
                Cerrar
              </button>
            </div>

            {loading ? <p className="mt-4 text-gray-600">Cargando asistentes...</p> : null}
            {error ? <p className="mt-4 text-red-600">{error}</p> : null}
            {!loading && !error && attendingList.length === 0 ? (
              <p className="mt-4 text-gray-600">Todavia no hay asistentes confirmados.</p>
            ) : null}

            {!loading && !error && attendingList.length > 0 ? (
              <div className="mt-5 space-y-3">
                {attendingList.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-purple-100 bg-purple-50/40 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-lg font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm font-medium text-purple-700">
                        Acompanantes: {item.guestsCount}
                      </p>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">{formatDate(item.createdAt)}</p>
                    {item.message ? (
                      <p className="mt-2 text-sm text-gray-700">Mensaje: {item.message}</p>
                    ) : null}
                  </article>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {activeModal === "comments" ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
          onClick={closeModal}
        >
          <div
            className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-2xl font-bold text-gray-800">Comentarios recibidos</h4>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg border border-gray-200 px-3 py-1 text-sm"
              >
                Cerrar
              </button>
            </div>

            {loading ? <p className="mt-4 text-gray-600">Cargando comentarios...</p> : null}
            {error ? <p className="mt-4 text-red-600">{error}</p> : null}
            {!loading && !error && commentsList.length === 0 ? (
              <p className="mt-4 text-gray-600">Todavia no hay comentarios.</p>
            ) : null}

            {!loading && !error && commentsList.length > 0 ? (
              <div className="mt-5 space-y-3">
                {commentsList.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-pink-100 bg-pink-50/40 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-lg font-semibold text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">{formatDate(item.createdAt)}</p>
                    </div>
                    <p className="mt-2 text-sm text-gray-700">{item.comment}</p>
                  </article>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
