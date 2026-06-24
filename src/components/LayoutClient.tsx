"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";

type LayoutClientProps = {
  children: ReactNode;
};

export default function LayoutClient({ children }: LayoutClientProps) {
  const pathname = usePathname();

  // Routes where Header/Footer should be hidden
  const hiddenRoutes = ["/login", "/register", "/home"];

  const hideLayout =
    hiddenRoutes.includes(pathname) || pathname.startsWith("/admin");

  return (
    <div className="flex min-h-screen flex-col">
      {!hideLayout && <Header />}

      <main className="flex-1">{children}</main>

      {!hideLayout && <Footer />}
    </div>
  );
}