import { prisma } from "@/lib/prisma";
import { createUpcomingTripNotification } from "@/lib/notifications/service";

export const maxDuration = 60;

const UPCOMING_WINDOW_MS = 25 * 60 * 60 * 1000;
const BATCH_SIZE = 100;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const windowEnd = new Date(now.getTime() + UPCOMING_WINDOW_MS);
  let cursorId: string | undefined;
  let processed = 0;

  while (true) {
    const trips = await prisma.trip.findMany({
      where: {
        status: "SCHEDULED",
        scheduledStartAt: { gt: now, lte: windowEnd },
      },
      orderBy: [{ scheduledStartAt: "asc" }, { id: "asc" }],
      take: BATCH_SIZE,
      ...(cursorId ? { cursor: { id: cursorId }, skip: 1 } : {}),
      select: { id: true, tripNumber: true, scheduledStartAt: true },
    });
    if (!trips.length) break;

    for (const trip of trips) {
      await prisma.$transaction(async (tx) => {
        const currentTrip = await tx.trip.findFirst({
          where: {
            id: trip.id,
            status: "SCHEDULED",
            scheduledStartAt: { gt: now, lte: windowEnd },
          },
          select: { id: true, tripNumber: true, scheduledStartAt: true },
        });
        if (currentTrip) await createUpcomingTripNotification(tx, currentTrip);
      });
      processed++;
    }

    cursorId = trips[trips.length - 1].id;
    if (trips.length < BATCH_SIZE) break;
  }

  return Response.json({ processed, windowEnd: windowEnd.toISOString() });
}
