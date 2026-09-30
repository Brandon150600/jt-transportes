import { CircleDollarSign, Route, Wrench, type LucideIcon } from "lucide-react";
import type { NotificationType } from "@/generated/prisma/client/enums";

export function notificationIcon(type: NotificationType): LucideIcon {
  switch (type) {
    case "EXPENSE_CREATED":
      return CircleDollarSign;
    case "VEHICLE_MAINTENANCE_DUE":
      return Wrench;
    default:
      return Route;
  }
}
