import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireAnyRole } from "@/lib/auth/session";
import { ClientForm } from "../client-form";

export default async function NewClientPage() {
  await requireAnyRole("ADMIN", "SUPER_ADMIN");
  return <main className="min-h-screen bg-zinc-50"><div className="mx-auto max-w-3xl px-4 py-7 sm:px-6 lg:px-8"><Link href="/clients" className="inline-flex items-center gap-2 text-sm font-semibold text-company-700"><ArrowLeft className="size-4" /> Volver a clientes</Link><header className="mb-6 mt-5"><p className="text-sm font-semibold text-company-600">Directorio de clientes</p><h1 className="mt-1 text-3xl font-black text-zinc-900">Nuevo cliente</h1><p className="mt-2 text-sm text-zinc-500">Registra la empresa y agrega sus ubicaciones desde el detalle.</p></header><ClientForm /></div></main>;
}
