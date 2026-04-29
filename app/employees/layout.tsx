import AppShell from '@/components/AppShell';

export default function EmployeesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
