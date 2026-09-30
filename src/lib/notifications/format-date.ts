const relativeFormatter = new Intl.RelativeTimeFormat("es-MX", { numeric: "auto" });

export function formatNotificationDate(date: Date, now = new Date()) {
  const differenceSeconds = Math.round((date.getTime() - now.getTime()) / 1000);
  const absoluteSeconds = Math.abs(differenceSeconds);

  if (absoluteSeconds < 60) return relativeFormatter.format(Math.round(differenceSeconds), "second");
  if (absoluteSeconds < 60 * 60) return relativeFormatter.format(Math.round(differenceSeconds / 60), "minute");
  if (absoluteSeconds < 24 * 60 * 60) return relativeFormatter.format(Math.round(differenceSeconds / (60 * 60)), "hour");
  if (absoluteSeconds < 7 * 24 * 60 * 60) return relativeFormatter.format(Math.round(differenceSeconds / (24 * 60 * 60)), "day");

  return date.toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Mexico_City",
  });
}
