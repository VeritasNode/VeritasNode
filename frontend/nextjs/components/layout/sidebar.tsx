import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  LayoutDashboard,
  ShieldCheck,
  FileSearch,
  Activity,
  GitBranch,
  Settings,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    description: "Overview and analytics",
  },
  {
    name: "Verifications",
    href: "/verifications",
    icon: ShieldCheck,
    description: "Submit and view verifications",
  },
  {
    name: "Audit Trail",
    href: "/audit",
    icon: FileSearch,
    description: "Immutable audit history",
  },
  {
    name: "Activity",
    href: "/activity",
    icon: Activity,
    description: "Real-time monitoring",
  },
  {
    name: "Repositories",
    href: "/repositories",
    icon: GitBranch,
    description: "Repo verification",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Configuration",
  },
];

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xl"
      >
        {mobileOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </button>

      {/* Sidebar overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r border-white/5 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:glow transition-all">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg gradient-text">VeritasNode</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all group"
              onClick={() => setMobileOpen(false)}
            >
              <item.icon className="w-5 h-5 flex-shrink-0 group-hover:text-primary transition-colors" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-xs text-muted-foreground/60">
                  {item.description}
                </span>
              </div>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-glow" />
            <span>Stellar Testnet</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
