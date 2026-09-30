import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Pencil, Phone, Route } from "lucide-react";
import { setExternalCarrierActive } from "@/app/actions/external-carriers";
import { requireAnyRole } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const statusLabels = { SCHEDULED: "Programado", IN_PROGRESS: "En curso", COMPLETED: "Completado", CANCELLED: "Cancelado" };

export default async function ExternalCarrierProfilePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAnyRole("ADMIN", "SUPER_ADMIN");
  const { id } = await params;
  const carrier = await prisma.externalCarrier.findUnique({ where: { id } });
  if (!carrier) notFound();

  const where = { executionType: "SUBCONTRACTED" as const, externalCarrierId: id };
  const financialWhere = { ...where, status: { not: "CANCELLED" as const } };
  const [trips, statusCounts, totals, customerPending, customerPaid, carrierPending, carrierPaid] = await Promise.all([
    prisma.trip.findMany({ where, orderBy: [{ scheduledStartAt: "desc" }, { createdAt: "desc" }], take: 20, select: {
      id: true, tripNumber: true, status: true, scheduledStartAt: true,
      clientNameSnapshot: true, origin: true, destinationNameSnapshot: true,
      revenue: true, subcontractorCost: true,
      customerPaymentStatus: true, subcontractorPaymentStatus: true,
    } }),
    prisma.trip.groupBy({ by: ["status"], where, _count: { _all: true } }),
    prisma.trip.aggregate({ where: financialWhere, _count: { _all: true }, _sum: { revenue: true, subcontractorCost: true } }),
    prisma.trip.aggregate({ where: { ...financialWhere, customerPaymentStatus: "PENDING" }, _sum: { revenue: true } }),
    prisma.trip.aggregate({ where: { ...financialWhere, customerPaymentStatus: "PAID" }, _sum: { revenue: true } }),
    prisma.trip.aggregate({ where: { ...financialWhere, subcontractorPaymentStatus: "PENDING" }, _sum: { subcontractorCost: true } }),
    prisma.trip.aggregate({ where: { ...financialWhere, subcontractorPaymentStatus: "PAID" }, _sum: { subcontractorCost: true } }),
  ]);

  const countByStatus = (status: keyof typeof statusLabels) => statusCounts.find((entry) => entry.status === status)?._count._all ?? 0;
  const revenue = Number(totals._sum.revenue ?? 0);
  const subcontractorCost = Number(totals._sum.subcontractorCost ?? 0);
  const money = (amount: unknown) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(Number(amount ?? 0));

  return <main className="min-h-screen bg-zinc-50"><div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
    <Link href="/external-carriers" className="inline-flex items-center gap-2 text-sm font-semibold text-company-700"><ArrowLeft className="size-4" /> Volver a transportistas</Link>
    <header className="mt-5 flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:flex-row sm:items-start sm:justify-between sm:p-6">
      <div className="min-w-0"><div className="flex flex-wrap items-center gap-3"><h1 className="break-words text-2xl font-black text-zinc-950 sm:text-3xl">{carrier.businessName}</h1><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${carrier.active ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-600"}`}>{carrier.active ? "Activo" : "Inactivo"}</span></div>
        {carrier.contactName && <p className="mt-2 text-sm text-zinc-600">Contacto: {carrier.contactName}</p>}
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-500">{carrier.phone && <a href={`tel:${carrier.phone}`} className="inline-flex items-center gap-2 hover:text-company-700"><Phone className="size-4" />{carrier.phone}</a>}{carrier.email && <a href={`mailto:${carrier.email}`} className="inline-flex items-center gap-2 hover:text-company-700"><Mail className="size-4" />{carrier.email}</a>}{carrier.taxId && <span>RFC: {carrier.taxId}</span>}</div>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2"><Link href={`/external-carriers/${id}/edit`} className="inline-flex h-10 items-center gap-2 rounded-xl border border-zinc-200 px-4 text-sm font-semibold"><Pencil className="size-4" /> Editar</Link><form action={setExternalCarrierActive}><input type="hidden" name="id" value={carrier.id} /><input type="hidden" name="active" value={String(carrier.active)} /><button className="h-10 rounded-xl border border-zinc-200 px-4 text-sm font-semibold text-zinc-600">{carrier.active ? "Desactivar" : "Activar"}</button></form></div>
    </header>

    {carrier.notes && <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"><h2 className="text-sm font-bold text-zinc-800">Notas</h2><p className="mt-2 whitespace-pre-wrap text-sm text-zinc-600">{carrier.notes}</p></section>}

    <section className="mt-5"><div className="mb-3 flex items-end justify-between gap-3"><div><h2 className="font-bold text-zinc-950">Actividad de viajes</h2><p className="mt-1 text-xs text-zinc-500">{statusCounts.reduce((count, entry) => count + entry._count._all, 0)} viajes registrados con este transportista.</p></div><Link href={`/trips?type=SUBCONTRACTED&carrierId=${encodeURIComponent(id)}`} className="shrink-0 text-sm font-semibold text-company-700">Ver viajes</Link></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-4"><Summary label="Programados" value={String(countByStatus("SCHEDULED"))} /><Summary label="En curso" value={String(countByStatus("IN_PROGRESS"))} /><Summary label="Completados" value={String(countByStatus("COMPLETED"))} /><Summary label="Cancelados" value={String(countByStatus("CANCELLED"))} /></div></section>

    <section className="mt-6"><div className="mb-3"><h2 className="font-bold text-zinc-950">Cuenta de viajes subcontratados</h2><p className="mt-1 text-xs text-zinc-500">Saldos calculados con los importes y estados de pago registrados en cada viaje.</p></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6"><Summary label="Ingreso a clientes" value={money(revenue)} /><Summary label="Costo del transportista" value={money(subcontractorCost)} /><Summary label="Margen directo" value={money(revenue - subcontractorCost)} emphasize /><Summary label="Pendiente de cobro" value={money(customerPending._sum.revenue)} /><Summary label="Cobrado a clientes" value={money(customerPaid._sum.revenue)} /><Summary label="Pendiente de pago" value={money(carrierPending._sum.subcontractorCost)} /><Summary label="Pagado al transportista" value={money(carrierPaid._sum.subcontractorCost)} /></div></section>

    <section className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-zinc-100 p-5"><div><h2 className="font-bold text-zinc-950">Viajes recientes</h2><p className="mt-1 text-xs text-zinc-500">Últimos {trips.length} viajes asociados a este transportista.</p></div><Route className="size-5 text-zinc-400" /></div>{trips.length ? <div className="divide-y divide-zinc-100">{trips.map((trip) => <Link key={trip.id} href={`/trips/${trip.id}`} className="flex flex-col gap-3 p-4 transition hover:bg-zinc-50 sm:flex-row sm:items-center sm:justify-between sm:px-5"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="font-semibold text-zinc-900">{trip.tripNumber}</span><span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">{statusLabels[trip.status]}</span><PaymentBadge label="Cobro" status={trip.customerPaymentStatus} /><PaymentBadge label="Pago" status={trip.subcontractorPaymentStatus} /></div><p className="mt-1 truncate text-sm text-zinc-600">{trip.clientNameSnapshot} · {trip.origin} → {trip.destinationNameSnapshot}</p><p className="mt-1 text-xs text-zinc-500">{trip.scheduledStartAt.toLocaleDateString("es-MX", { dateStyle: "medium", timeZone: "America/Mexico_City" })}</p></div><div className="flex shrink-0 gap-4 text-xs sm:flex-col sm:gap-1 sm:text-right"><span className="text-zinc-500">Ingreso: <strong className="text-zinc-800">{money(trip.revenue)}</strong></span><span className="text-zinc-500">Costo: <strong className="text-zinc-800">{money(trip.subcontractorCost)}</strong></span></div></Link>)}</div> : <p className="p-8 text-center text-sm text-zinc-500">Este transportista aún no tiene viajes asociados.</p>}</section>
  </div></main>;
}

function Summary({ label, value, emphasize = false }: { label: string; value: string; emphasize?: boolean }) {
  return <article className={`min-w-0 rounded-xl border p-4 shadow-sm ${emphasize ? "border-company-100 bg-company-50" : "border-zinc-200 bg-white"}`}><p className="text-xs font-medium text-zinc-500">{label}</p><p className="mt-2 break-words text-base font-bold text-zinc-900 sm:text-lg">{value}</p></article>;
}

function PaymentBadge({ label, status }: { label: string; status: "PENDING" | "PAID" | null }) {
  if (!status) return null;
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${status === "PAID" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{label}: {status === "PAID" ? "Pagado" : "Pendiente"}</span>;
}
