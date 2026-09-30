import { PortalHeader } from "@/components/portal/portal-header";
import { PortalFooter } from "@/components/portal/portal-footer";
import { requireUser } from "@/lib/auth/session";
import { formatNotificationDate } from "@/lib/notifications/format-date";
import { prisma } from "@/lib/prisma";

export default async function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await requireUser();
    const [unreadCount, recentRows] = await Promise.all([
        prisma.notification.count({
            where: { createdAt: { gte: user.createdAt }, reads: { none: { userId: user.id } } },
        }),
        prisma.notification.findMany({
            orderBy: [{ createdAt: "desc" }, { id: "desc" }],
            take: 5,
            include: { reads: { where: { userId: user.id }, select: { readAt: true } } },
        }),
    ]);
    const now = new Date();
    const recentNotifications = recentRows.map((notification) => ({
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        displayDate: formatNotificationDate(notification.createdAt, now),
        isRead: notification.createdAt < user.createdAt || notification.reads.length > 0,
    }));

    return (
        <PortalHeader user={{ name: user.name, email: user.email, role: user.role }} unreadCount={unreadCount} notifications={recentNotifications}>
            <div className="min-h-[calc(100vh-4rem)] bg-zinc-50 text-zinc-900">{children}</div>
            <PortalFooter />
        </PortalHeader>
    );
}
