"use client";

import { usePathname } from "next/navigation";
import SidebarLayout from "./sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Pages that don't need the sidebar
  const standalonePages = ["/login", "/register"];

  if (standalonePages.includes(pathname)) {
    return <>{children}</>;
  }

  return <SidebarLayout>{children}</SidebarLayout>;
}
