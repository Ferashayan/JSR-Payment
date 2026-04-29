import Link from 'next/link';

export default function NavItem({ href, icon, label, isActive }: { href: string; icon: string; label: string; isActive: boolean }) {
  return (
    <Link
      href={href}
      prefetch={true}
      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all group relative ${isActive ? 'bg-white/15 text-primary-fixed shadow-inner' : 'text-outline-variant hover:bg-white/10 hover:text-white'}`}
    >
      <span className="material-symbols-outlined text-[20px]">{icon}</span>
      <span className="absolute -top-10 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">{label}</span>
    </Link>
  );
}
