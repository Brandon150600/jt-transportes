import { logout } from "@/app/actions/auth";
import { requireUser } from "@/lib/auth/session";

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-company-600">JT Transportes</p>
            <h1 className="mt-1 text-3xl font-black">Panel de operaciones</h1>
          </div>
          <form action={logout}>
            <button className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold">
              Cerrar sesión
            </button>
          </form>
        </div>
        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-zinc-500">Sesión activa</p>
          <h2 className="mt-1 text-xl font-bold">{user.name ?? user.email}</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Desde aquí podrás consultar tus envíos y operaciones logísticas.
          </p>
        </section>
      </div>
    </main>
  );
}
