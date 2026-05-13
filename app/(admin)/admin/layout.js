'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Briefcase, MessageSquare, LogOut, Settings, BookOpen, LayoutGrid } from 'lucide-react';
import { useUserMutations } from '@/hooks/useUser';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Categories', href: '/admin/categories', icon: LayoutGrid },
  { label: 'Blog Posts', href: '/admin/blog', icon: FileText },
  { label: 'Projects', href: '/admin/projects', icon: Briefcase },
  { label: 'Case Studies', href: '/admin/case-studies', icon: BookOpen },
  { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { logout } = useUserMutations();

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white flex flex-col fixed inset-y-0 left-0 z-50 transition-all duration-300">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center font-bold text-primary italic">CM</div>
          <span className="font-sora font-bold tracking-tight text-lg">Admin Panel</span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-accent text-primary shadow-lg shadow-accent/20" 
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className={cn("w-4 h-4", isActive ? "stroke-[2.5px]" : "stroke-2")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Button
            onClick={() => logout()}
            variant="ghost"
            className="w-full justify-start text-white/70 hover:bg-red-500/20 hover:text-red-400 gap-3 px-4 h-11"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pl-64 min-h-screen">
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between px-8">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
            {navItems.find(item => pathname === item.href || pathname.startsWith(item.href))?.label || 'Overview'}
          </h2>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-slate-800">Admin User</span>
              <span className="text-[10px] text-slate-400">Super Admin</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
              <Settings className="w-4 h-4" />
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
