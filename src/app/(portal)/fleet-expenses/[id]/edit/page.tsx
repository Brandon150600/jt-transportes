import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAnyRole } from "@/lib/auth/session";
import { ExpenseForm } from "../../expense-form";

export default async function EditFleetExpensePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAnyRole("ADMIN", "SUPER_ADMIN");
  const { id } = await params;
  const expense = await prisma.fleetExpense.findUnique({ where: { id }, include: { items: true } });
  if (!expense) notFound();
  const [vehicles, suppliers, trips] = await Promise.all([
    prisma.vehicle.findMany({ orderBy: { economicNumber: "asc" }, select: { id: true, economicNumber: true, brand: true, model: true } }),
    prisma.supplier.findMany({ where: { OR: [{ active: true }, { id: expense.supplierId ?? "" }] }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.trip.findMany({ where: { OR: [{ status: { in: ["SCHEDULED", "IN_PROGRESS", "COMPLETED"] } }, { id: expense.tripId ?? "" }] }, orderBy: { scheduledStartAt: "desc" }, select: { id: true, tripNumber: true, vehicleId: true, clientNameSnapshot: true, status: true } }),
  ]);
  return <main className="min-h-screen bg-zinc-50"><div className="mx-auto max-w-4xl px-4 py-7 sm:px-6 lg:px-8">
    <Link href={`/fleet-expenses/${id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-company-700"><ArrowLeft className="size-4" /> Volver al gasto</Link>
    <header className="mb-6 mt-5"><p className="text-sm font-semibold text-company-600">Gastos de flota</p><h1 className="mt-1 text-3xl font-black text-zinc-900">Editar gasto</h1></header>
    <ExpenseForm vehicles={vehicles} suppliers={suppliers} trips={trips} expense={{
      id: expense.id, vehicleId: expense.vehicleId, supplierId: expense.supplierId,
      tripId: expense.tripId,
      category: expense.category, expenseDate: expense.expenseDate.toISOString().slice(0, 10),
      description: expense.description, total: expense.total.toString(), laborAmount: expense.laborAmount.toString(),
      mileage: expense.mileage, receiptNumber: expense.receiptNumber, notes: expense.notes,
      items: expense.items.map((item) => ({ description: item.description, quantity: Number(item.quantity), unitCost: Number(item.unitCost), unit: item.unit ?? "" })),
    }} />
  </div></main>;
}
