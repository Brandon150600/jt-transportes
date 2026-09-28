import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, Mail, MapPin, Pencil, Phone, Plus, Truck } from "lucide-react";
import { setClientActive, setClientAddressActive } from "@/app/actions/clients";
import { ClientAddressForm, type ClientAddressData } from "../address-form";
import { requireAnyRole } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAnyRole("ADMIN", "SUPER_ADMIN");
  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: { addresses: { orderBy: [{ active: "desc" }, { name: "asc" }] } },
  });
  if (!client) notFound();

  return <main className="min-h-screen bg-zinc-50"><div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:px-8">
    <Link href="/clients" className="inline-flex items-center gap-2 text-sm font-semibold text-company-700"><ArrowLeft className="size-4" /> Volver a clientes</Link>
    <header className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="flex items-start gap-3"><span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-company-50 text-company-600"><Building2 className="size-6" /></span><div><div className="flex flex-wrap items-center gap-2"><h1 className="text-3xl font-black text-zinc-900">{client.commercialName || client.businessName}</h1><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${client.active ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}>{client.active ? "Activo" : "Inactivo"}</span></div>{client.commercialName && <p className="mt-1 text-sm text-zinc-500">{client.businessName}</p>}</div></div><div className="flex gap-2"><Link href={`/clients/${id}/edit`} className="inline-flex h-10 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700"><Pencil className="size-4" /> Editar</Link><form action={setClientActive}><input type="hidden" name="id" value={id} /><input type="hidden" name="active" value={String(client.active)} /><button className="h-10 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold">{client.active ? "Desactivar" : "Activar"}</button></form></div></header>
    <div className="mt-6 grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
      <section className="h-fit rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"><h2 className="font-bold text-zinc-900">Información general</h2><dl className="mt-4 space-y-4"><Info label="Razón social" value={client.businessName} /><Info label="Nombre comercial" value={client.commercialName} /><Info label="RFC" value={client.taxId} /><Info label="Contacto principal" value={client.contactName} /><Info icon={Phone} label="Teléfono" value={client.phone} /><Info icon={Mail} label="Correo" value={client.email} />{client.notes && <Info label="Notas" value={client.notes} />}</dl><p className="mt-5 border-t border-zinc-100 pt-4 text-xs text-zinc-400">Cliente creado {client.createdAt.toLocaleDateString("es-MX")}</p></section>
      <div className="space-y-5">
        <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"><div className="flex flex-col gap-3 border-b border-zinc-100 p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-bold text-zinc-900">Direcciones y ubicaciones</h2><p className="mt-1 text-sm text-zinc-500">Plantas, sucursales, centros de distribución y otros destinos.</p></div><details className="group"><summary className="inline-flex h-10 cursor-pointer list-none items-center justify-center gap-2 rounded-xl bg-company px-4 text-sm font-bold text-white"><Plus className="size-4" /> Agregar dirección</summary><div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4"><ClientAddressForm clientId={client.id} /></div></details></div>
          {client.addresses.length ? <div className="divide-y divide-zinc-100">{client.addresses.map((address) => <article key={address.id} className="relative p-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div className="flex min-w-0 gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600"><MapPin className="size-5" /></span><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-zinc-900">{address.name}</h3><span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${address.active ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}>{address.active ? "Activa" : "Inactiva"}</span></div><p className="mt-1 text-sm text-zinc-600">{formatAddress(address)}</p>{address.reference && <p className="mt-1 text-xs text-zinc-500">Referencia: {address.reference}</p>}{address.notes && <p className="mt-2 whitespace-pre-wrap text-xs text-zinc-500">{address.notes}</p>}</div></div><div className="flex shrink-0 items-center gap-3 pl-13 sm:pl-0"><details className="group"><summary className="cursor-pointer list-none text-sm font-semibold text-company-700">Editar</summary><div className="absolute left-4 right-4 z-10 mt-2 max-w-2xl rounded-xl border border-zinc-200 bg-white p-4 shadow-xl sm:left-auto sm:right-8"><ClientAddressForm clientId={client.id} address={address as ClientAddressData} /></div></details><form action={setClientAddressActive}><input type="hidden" name="id" value={address.id} /><input type="hidden" name="clientId" value={client.id} /><input type="hidden" name="active" value={String(address.active)} /><button className="text-sm font-semibold text-zinc-600">{address.active ? "Desactivar" : "Activar"}</button></form></div></div></article>)}</div> : <div className="p-10 text-center"><MapPin className="mx-auto size-8 text-zinc-300" /><p className="mt-3 font-semibold text-zinc-800">Todavía no hay direcciones</p><p className="mt-1 text-sm text-zinc-500">Agrega la primera planta, sucursal o ubicación de este cliente.</p></div>}
        </section>
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><Truck className="size-5 text-zinc-400" /><div><h2 className="font-bold text-zinc-900">Viajes</h2><p className="mt-1 text-sm text-zinc-500">El módulo de viajes todavía no está conectado. Aquí aparecerá el historial cuando esté disponible.</p></div></div></section>
      </div>
    </div>
  </div></main>;
}

function formatAddress(address: ClientAddressData) {
  const street = [address.street, address.exteriorNumber, address.interiorNumber ? `Int. ${address.interiorNumber}` : null].filter(Boolean).join(" ");
  return [street, address.neighborhood, address.city, address.state, address.postalCode, address.country].filter(Boolean).join(", ");
}

function Info({ icon: Icon, label, value }: { icon?: typeof Building2; label: string; value: string | null }) {
  return <div><dt className="text-xs font-medium text-zinc-400">{label}</dt><dd className="mt-1 flex items-center gap-2 whitespace-pre-wrap text-sm font-medium text-zinc-700">{Icon && <Icon className="size-4 shrink-0 text-zinc-400" />}{value ?? "—"}</dd></div>;
}
