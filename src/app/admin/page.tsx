import { logout } from "@/app/actions/auth";
import { requireRole } from "@/lib/auth/session";

export default async function AdminPage() {
  const user = await requireRole("ADMIN");

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-red-300">JT Transportes</p>
            <h1 className="mt-1 text-3xl font-black">Administración</h1>
          </div>
          <form action={logout}>
            <button className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold">
              Cerrar sesión
            </button>
          </form>
        </div>
        <section className="mt-8 rounded-2xl bg-white/10 p-6">
          <p className="text-sm text-zinc-300">Administrador autenticado</p>
          <h2 className="mt-1 text-xl font-bold">{user.name ?? user.email}</h2>
          <p className="mt-2 text-sm text-zinc-300">
            Este espacio queda reservado para la gestión de usuarios, flota y operaciones.
          </p>
        </section>
      </div>
    </main>
  );
}
