"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { saveFleetExpense, type FleetExpenseFormState } from "@/app/actions/fleet-expenses";

type VehicleOption = { id: string; economicNumber: string; brand: string; model: string };
type SupplierOption = { id: string; name: string };
type Item = { description: string; quantity: number; unitCost: number };
type ExistingExpense = {
  id: string; vehicleId: string; supplierId: string | null; category: string;
  expenseDate: string; description: string; total: string; laborAmount: string;
  mileage: number | null; receiptNumber: string | null; notes: string | null;
  items: Item[];
};

const categories = [
  ["PARTS", "Refacciones"], ["MAINTENANCE", "Mantenimiento"],
  ["WASH", "Lavado"], ["TIRES", "Llantas"], ["OTHER", "Otro"],
];
const initialState: FleetExpenseFormState = {};

export function ExpenseForm({
  vehicles, suppliers, expense,
}: { vehicles: VehicleOption[]; suppliers: SupplierOption[]; expense?: ExistingExpense }) {
  const [state, action, pending] = useActionState(saveFleetExpense, initialState);
  const [detailed, setDetailed] = useState(Boolean(expense?.items.length));
  const [items, setItems] = useState<Item[]>(expense?.items ?? []);
  const [labor, setLabor] = useState(Number(expense?.laborAmount) || 0);
  const [newSupplier, setNewSupplier] = useState(false);
  const subtotal = items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitCost) || 0), 0);
  const total = subtotal + labor;

  function updateItem(index: number, key: keyof Item, value: string) {
    setItems((current) => current.map((item, itemIndex) => itemIndex === index
      ? { ...item, [key]: key === "description" ? value : Number(value) }
      : item));
  }

  return (
    <form action={action} className="space-y-6">
      {expense && <input type="hidden" name="id" value={expense.id} />}
      <input type="hidden" name="items" value={JSON.stringify(detailed ? items.filter((item) => item.description.trim()) : [])} />
      {state.error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{state.error}</div>}

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-bold text-zinc-900">Datos del gasto</h2>
        <p className="mt-1 text-sm text-zinc-500">Captura lo esencial ahora; puedes agregar conceptos si tienes el detalle.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Unidad" error={state.fieldErrors?.vehicleId}>
            <select name="vehicleId" required defaultValue={expense?.vehicleId ?? ""} className={inputClass}>
              <option value="" disabled>Selecciona una unidad</option>
              {vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.economicNumber} · {vehicle.brand} {vehicle.model}</option>)}
            </select>
          </Field>
          <Field label="Categoría" error={state.fieldErrors?.category}>
            <select name="category" defaultValue={expense?.category ?? "PARTS"} className={inputClass}>
              {categories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </Field>
          <Field label="Fecha" error={state.fieldErrors?.expenseDate}>
            <input type="date" name="expenseDate" required defaultValue={expense?.expenseDate ?? new Date().toISOString().slice(0, 10)} className={inputClass} />
          </Field>
          <Field label="Proveedor (opcional)" error={state.fieldErrors?.supplierId}>
            {newSupplier ? (
              <div className="space-y-2">
                <input name="newSupplierName" placeholder="Nombre del proveedor" required className={inputClass} />
                <input name="newSupplierPhone" placeholder="Teléfono (opcional)" className={inputClass} />
                <button type="button" onClick={() => setNewSupplier(false)} className="text-sm font-semibold text-company-700">Elegir proveedor existente</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <select name="supplierId" defaultValue={expense?.supplierId ?? ""} className={`${inputClass} min-w-0 flex-1`}>
                  <option value="">Sin proveedor</option>
                  {suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}
                </select>
                <button type="button" onClick={() => setNewSupplier(true)} className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-zinc-200 px-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"><Plus className="size-4" /> Nuevo</button>
              </div>
            )}
          </Field>
          <Field label="Descripción" error={state.fieldErrors?.description}>
            <input name="description" required defaultValue={expense?.description ?? ""} placeholder="Ej. Compra de refacciones" className={inputClass} />
          </Field>
          {!detailed && <Field label="Total" error={state.fieldErrors?.amount}>
            <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">$</span><input name="amount" type="number" min="0.01" step="0.01" required defaultValue={expense?.total ?? ""} placeholder="0.00" className={`${inputClass} pl-8`} /></div>
          </Field>}
          <div className="sm:col-span-2">
            <button type="button" onClick={() => setDetailed((value) => !value)} className="text-sm font-semibold text-company-700">{detailed ? "Ocultar conceptos detallados" : "Agregar conceptos detallados (opcional)"}</button>
          </div>
        </div>
      </section>

      {detailed && <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between"><div><h2 className="text-lg font-bold text-zinc-900">Conceptos</h2><p className="mt-1 text-sm text-zinc-500">Agrega productos o servicios de la nota.</p></div><button type="button" onClick={() => setItems((current) => [...current, { description: "", quantity: 1, unitCost: 0 }])} className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm font-semibold"><Plus className="size-4" /> Agregar</button></div>
        <div className="mt-4 space-y-3">
          {items.map((item, index) => <div key={index} className="grid gap-2 rounded-xl bg-zinc-50 p-3 sm:grid-cols-[minmax(0,1fr)_100px_140px_100px_40px] sm:items-end">
            <label className="text-xs font-medium text-zinc-600">Concepto<input value={item.description} onChange={(event) => updateItem(index, "description", event.target.value)} className={`${inputClass} mt-1`} placeholder="Filtro de aceite" /></label>
            <label className="text-xs font-medium text-zinc-600">Cantidad<input type="number" min="0.001" step="0.001" value={item.quantity} onChange={(event) => updateItem(index, "quantity", event.target.value)} className={`${inputClass} mt-1`} /></label>
            <label className="text-xs font-medium text-zinc-600">Costo unitario<input type="number" min="0" step="0.01" value={item.unitCost} onChange={(event) => updateItem(index, "unitCost", event.target.value)} className={`${inputClass} mt-1`} /></label>
            <p className="pb-3 text-sm font-semibold text-zinc-800">${((Number(item.quantity) || 0) * (Number(item.unitCost) || 0)).toFixed(2)}</p>
            <button type="button" aria-label="Eliminar concepto" onClick={() => setItems((current) => current.filter((_, i) => i !== index))} className="mb-2 flex size-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="size-4" /></button>
          </div>)}
          {!items.some((item) => item.description.trim()) && <><p className="rounded-xl border border-dashed border-zinc-300 p-5 text-center text-sm text-zinc-500">Agrega conceptos o captura el total directamente.</p><Field label="Total del gasto" error={state.fieldErrors?.amount}><input name="amount" type="number" min="0.01" step="0.01" defaultValue={expense?.total ?? ""} className={inputClass} /></Field></>}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Mano de obra"><input name="laborAmount" type="number" min="0" step="0.01" value={labor} onChange={(event) => setLabor(Number(event.target.value))} className={inputClass} /></Field>
          <div className="rounded-xl bg-zinc-950 p-4 text-white"><p className="text-xs text-zinc-400">Total calculado</p><p className="mt-1 text-2xl font-bold">${total.toFixed(2)}</p></div>
        </div>
      </section>}

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-bold text-zinc-900">Datos adicionales <span className="font-normal text-zinc-400">(opcionales)</span></h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Kilometraje"><input name="mileage" type="number" min="0" defaultValue={expense?.mileage ?? ""} className={inputClass} /></Field>
          <Field label="Factura o ticket"><input name="receiptNumber" defaultValue={expense?.receiptNumber ?? ""} className={inputClass} /></Field>
          <Field label="Notas"><textarea name="notes" rows={3} defaultValue={expense?.notes ?? ""} className={inputClass} /></Field>
        </div>
      </section>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Link href={expense ? `/fleet-expenses/${expense.id}` : "/fleet-expenses"} className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 px-5 text-sm font-semibold text-zinc-700">Cancelar</Link><button disabled={pending} className="inline-flex h-11 items-center justify-center rounded-xl bg-company px-6 text-sm font-bold text-white disabled:opacity-60">{pending ? "Guardando…" : "Guardar gasto"}</button></div>
    </form>
  );
}

const inputClass = "h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-company focus:ring-4 focus:ring-company-100";
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-zinc-700">{label}{children}{error && <span className="mt-1 block text-xs text-red-600">{error}</span>}</label>;
}
