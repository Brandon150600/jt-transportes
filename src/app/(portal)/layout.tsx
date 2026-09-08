import { PortalHeader } from "@/components/portal/portal-header";
import { requireUser } from "@/lib/auth/session";

export default async function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await requireUser();

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900">
            <PortalHeader user={user} />

            <div className="min-h-[calc(100vh-4rem)]">
                {children}
            </div>
        </div>
    );
}