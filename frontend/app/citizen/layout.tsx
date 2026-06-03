import { CitizenShell } from '../../components/ui/shells/CitizenShell';

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
  return <CitizenShell>{children}</CitizenShell>;
}
