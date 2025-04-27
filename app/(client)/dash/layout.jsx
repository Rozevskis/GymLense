"use client"
import "@/app/globals.css";
import DashFooter from "@/components/DashFooter";
import DashHeader from "@/components/DashHeader";
import PageLoader from "@/components/animations/PageLoader"
import Lenis from "lenis";


import { useState, useEffect, Suspense } from "react";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {

  const pathname = usePathname();
  const [activePage, setActivePage] = useState(pathname);

  useEffect(() => {
    setActivePage(pathname);
  }, [pathname]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="gradient-div absolute pointer-events-none"></div>
      <DashHeader />
      <main className="flex-1 w-full">
          <Suspense fallback={<PageLoader />}>
          {children}
          </Suspense>
      </main>
      <DashFooter activePage={activePage} />
    </div>
  );
}