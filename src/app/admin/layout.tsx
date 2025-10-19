import { AdminAuthProvider } from "@/admin/contexts/AdminAuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>;
}
