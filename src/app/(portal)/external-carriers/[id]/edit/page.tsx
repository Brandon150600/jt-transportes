import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireAnyRole } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { ExternalCarrierForm } from "../../external-carrier-form";

export default async function EditExternalCarrierPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAnyRole("ADMIN", "SUPER_ADMIN");
  const { id } = await params;
  const carrier = await prisma.externalCarrier.findUnique({ where: { id } });
  if (!carrier) notFound();
  return <main className="min-h-screen bg-zinc-50"><div className="mx-auto max-w-3xl px-4 py-7 sm:px-6 lg:px-8"><Link href="/external-carriers" className="inline-flex items-center gap-2 text-sm font-semibold text-company-700"><ArrowLeft className="size-4" /> Volver a transportistas</Link><header className="mb-6 mt-5"><h1 className="text-3xl font-black text-zinc-900">Editar transportista</h1></header><ExternalCarrierForm carrier={carrier} /></div></main>;
}
