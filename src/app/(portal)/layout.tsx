import { PortalHeader } from "@/components/portal/portal-header";
import { PortalFooter } from "@/components/portal/portal-footer";
import { requireUser } from "@/lib/auth/session";

export default async function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await requireUser();

    return (
        <PortalHeader user={user}>
            <div className="min-h-[calc(100vh-4rem)] bg-zinc-50 text-zinc-900">{children}</div>
            <PortalFooter />
        </PortalHeader>
    );
}
