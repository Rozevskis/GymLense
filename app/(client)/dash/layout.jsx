"use client"
import "@/app/globals.css";
import DashFooter from "@/components/DashFooter";
import DashHeader from "@/components/DashHeader";
import PageLoader from "@/components/animations/PageLoader"

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [activePage, setActivePage] = useState(pathname);

  useEffect(() => {
    setActivePage(pathname);
  }, [pathname]);

  return (
    <html lang="en" className="bg-zinc-900 w-full flex justify-center items-center">
      <body
        className="antialiased max-w-lg bg-[var(--background)] flex justify-center items-center w-full min-h-[100dvh] relative"
      >
        <DashHeader activePage={activePage}/>
        <PageLoader>
        {children}
        </PageLoader>
        <DashFooter activePage={activePage} />
      </body>
    </html>
  );
}