import { requireWorkspace } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";
export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, business } = await requireWorkspace();
  return (
    <AppShell businessName={business.name} userName={user.name}>
      {children}
    </AppShell>
  );
}
