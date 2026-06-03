import { AdminShell } from '../../components/ui/shells/AdminShell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
