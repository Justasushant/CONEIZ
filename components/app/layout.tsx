import React from "react";
import SiteLayout from "@/components/Layout";

import "./globals.css";

export const metadata = {
  title: "CONEIZ | The Future Built by CONEIZ",
  description: "CONEIZ delivers cloud-first solutions and tools built for modern businesses.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://i.postimg.cc/NG3FSdV3/coneiz_logo_current.png?v=1" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700&family=Outfit:wght@200;300;400;500;600;700&display=swap"
          rel="stylesheet"
        />

      </head>
      <body>
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
