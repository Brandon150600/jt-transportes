import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAnyRole } from "@/lib/auth/session";
import { ExpenseForm } from "../expense-form";

export default async function NewFleetExpensePage() {
  await requireAnyRole("ADMIN", "SUPER_ADMIN");
  const [vehicles, suppliers] = await Promise.all([
    prisma.vehicle.findMany({ orderBy: { economicNumber: "asc" }, select: { id: true, economicNumber: true, brand: true, model: true } }),
    prisma.supplier.findMany({ where: { active: true }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  return <main className="min-h-screen bg-zinc-50"><div className="mx-auto max-w-4xl px-4 py-7 sm:px-6 lg:px-8">
    <Link href="/fleet-expenses" className="inline-flex items-center gap-2 text-sm font-semibold text-company-700"><ArrowLeft className="size-4" /> Volver a gastos</Link>
    <header className="mb-6 mt-5"><p className="text-sm font-semibold text-company-600">Gastos de flota</p><h1 className="mt-1 text-3xl font-black text-zinc-900">Registrar gasto</h1><p className="mt-2 text-sm text-zinc-500">Captura lo esencial en pocos pasos; el detalle es opcional.</p></header>
    <ExpenseForm vehicles={vehicles} suppliers={suppliers} />
  </div></main>;
}
