"use client"
import "@/app/globals.css";
import { Toaster } from "react-hot-toast";
import Script from 'next/script';

export default function SignInLayout({ children }) {
  return (
    <html lang="en" className="bg-zinc-900 w-full flex justify-center items-center">
      <body
        className={`antialiased max-w-lg bg-[var(--background)] flex justify-center items-center w-full min-h-[100dvh] relative`}
      >
        <Toaster position="top-center" />
        {children}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "rrqymgb0i2");
          `}
        </Script>
      </body>
    </html>
  );
}