"use client";

import { formatCurrency } from "@/lib/utils";
import { useMemo } from "react";

import type {
  RentalItemProps,
  ExtraServicesProps,
  RentalPeriodProps,
} from "@/types/rental"; // pas aan naar jouw typepad indien anders

type PriceInformationBlockProps = {
  rentalItems: RentalItemProps[];
  extraServices: ExtraServicesProps;
  rentalPeriod: RentalPeriodProps;
};

export default function PriceInformationBlock({
  rentalItems = [],
  extraServices = {},
  rentalPeriod = {},
}: PriceInformationBlockProps) {
  const depositAmount = 25;

  const { groupedItems, rentalSubtotal } = useMemo(() => {
    const grouped = new Map<string, { amount: number; total: number; days: number }>();

    for (const item of rentalItems) {
      const key = item.item_number;
      const start = new Date(item.startDate);
      const end = new Date(item.endDate);
      const days = Math.max(
        1,
        Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      );
      const total = item.total;

      if (grouped.has(key)) {
        const existing = grouped.get(key)!;
        existing.amount++;
        existing.total += total;
      } else {
        grouped.set(key, { amount: 1, total, days });
      }
    }

    const subtotal = Array.from(grouped.values()).reduce((sum, i) => sum + i.total, 0);

    return { groupedItems: grouped, rentalSubtotal: subtotal };
  }, [rentalItems]);

  const services: { label: string; total: number }[] = [];

  if (extraServices?.baggage_transport && extraServices?.baggage_pickup) {
    services.push({ label: "Bagagevervoer ophalen", total: 29.95 });
  }
  if (extraServices?.baggage_transport && extraServices?.baggage_delivery) {
    services.push({ label: "Bagagevervoer bezorgen", total: 29.95 });
  }
  if (extraServices?.transport_outbound) {
    services.push({ label: "Transport heenreis", total: 19.95 });
  }
  if (extraServices?.transport_return) {
    services.push({ label: "Transport terugreis", total: 19.95 });
  }

  const servicesSubtotal = services.reduce((sum, s) => sum + s.total, 0);
  const subtotal = rentalSubtotal + servicesSubtotal;
  const vat = subtotal * 0.21;
  const total = subtotal + vat + depositAmount;

  return (
    <div className="bg-white border rounded-xl p-6 space-y-6 shadow-sm">
      <h2 className="text-xl font-semibold">Prijsoverzicht</h2>

      {rentalPeriod?.numberOfDays > 0 && (
        <p className="text-sm text-muted-foreground">
          Huurperiode: {rentalPeriod?.numberOfDays} dagen
        </p>
      )}

      {groupedItems.size > 0 && (
        <div className="space-y-2">
          {[...groupedItems.entries()].map(([type, data]) => (
            <div className="flex justify-between text-sm" key={type}>
              <span>
                {type} – {data.amount} stuks × {data.days} dagen
              </span>
              <span className="tabular-nums">{formatCurrency(data.total)}</span>
            </div>
          ))}
        </div>
      )}

      {services.length > 0 && (
        <div className="space-y-2 pt-4 border-t">
          <p className="text-sm font-medium">Extra services</p>
          {services.map((s, idx) => (
            <div className="flex justify-between text-sm" key={idx}>
              <span>{s.label}</span>
              <span className="tabular-nums">{formatCurrency(s.total)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2 pt-4 border-t">
        <div className="flex justify-between text-sm">
          <span>Subtotaal</span>
          <span className="tabular-nums">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>BTW (21%)</span>
          <span className="tabular-nums">{formatCurrency(vat)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Borg</span>
          <span className="tabular-nums">{formatCurrency(depositAmount)}</span>
        </div>
        <div className="flex justify-between text-base font-bold border-t pt-3">
          <span>Totaal</span>
          <span className="tabular-nums">{formatCurrency(total)}</span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground pt-3">
        Prijzen zijn exclusief BTW. De definitieve prijs wordt berekend op basis van uw selectie en de exacte huurperiode. Borg wordt geretourneerd bij inlevering in goede staat.
      </p>
    </div>
  );
}
