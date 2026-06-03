import { OfficerShell } from '../../components/ui/shells/OfficerShell';

export default function OfficerLayout({ children }: { children: React.ReactNode }) {
  return <OfficerShell>{children}</OfficerShell>;
}
