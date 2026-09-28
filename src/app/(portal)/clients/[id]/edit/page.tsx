import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireAnyRole } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { ClientForm } from "../../client-form";

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAnyRole("ADMIN", "SUPER_ADMIN");
  const { id } = await params;
  const client = await prisma.client.findUnique({ where: { id } });
  if (!client) notFound();
  return <main className="min-h-screen bg-zinc-50"><div className="mx-auto max-w-3xl px-4 py-7 sm:px-6 lg:px-8"><Link href={`/clients/${id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-company-700"><ArrowLeft className="size-4" /> Volver al cliente</Link><header className="mb-6 mt-5"><p className="text-sm font-semibold text-company-600">Directorio de clientes</p><h1 className="mt-1 text-3xl font-black text-zinc-900">Editar cliente</h1></header><ClientForm client={client} /></div></main>;
}
