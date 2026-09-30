import { Monitor, ShieldCheck, X } from "lucide-react";
import { revokeOtherSessions, revokeSession } from "@/app/actions/settings";

type ActiveSession = {
  id: string;
  createdAt: Date;
  expiresAt: Date;
};

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Mexico_City",
});

export function ActiveSessions({ sessions, currentSessionId }: {
  sessions: ActiveSession[];
  currentSessionId: string | null;
}) {
  const otherSessions = sessions.filter((session) => session.id !== currentSessionId);

  return (
    <div className="border-t border-zinc-100 bg-zinc-50 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-600">
          {sessions.length === 1 ? "Hay una sesión activa." : `Hay ${sessions.length} sesiones activas.`}
          {" "}La lista muestra el inicio y vencimiento; el portal no registra el navegador ni el dispositivo.
        </p>
        {otherSessions.length > 0 && (
          <form action={revokeOtherSessions}>
            <button className="h-9 rounded-lg border border-red-200 bg-white px-3 text-xs font-semibold text-red-700 transition hover:bg-red-50">
              Cerrar las otras sesiones
            </button>
          </form>
        )}
      </div>

      {sessions.length === 0 ? (
        <p className="mt-4 rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-500">
          No hay sesiones activas registradas.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-zinc-100 overflow-hidden rounded-xl border border-zinc-200 bg-white">
          {sessions.map((session) => {
            const isCurrent = session.id === currentSessionId;
            return (
              <li key={session.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <div className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg ${isCurrent ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-600"}`}>
                    {isCurrent ? <ShieldCheck className="size-4" /> : <Monitor className="size-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-900">
                      {isCurrent ? "Sesión actual" : "Otra sesión"}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-zinc-500">
                      Inició {dateFormatter.format(session.createdAt)} · Vence {dateFormatter.format(session.expiresAt)}
                    </p>
                  </div>
                </div>
                {!isCurrent && (
                  <form action={revokeSession} className="sm:pl-12">
                    <input type="hidden" name="sessionId" value={session.id} />
                    <button aria-label="Cerrar esta sesión" className="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 px-3 text-xs font-semibold text-zinc-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700">
                      <X className="size-3.5" /> Cerrar sesión
                    </button>
                  </form>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
