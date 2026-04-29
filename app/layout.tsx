import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Jsr Payment Dashboard',
  description: 'منصة جسر لإدارة الرواتب والمدفوعات - Jsr FinTech Payroll Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
