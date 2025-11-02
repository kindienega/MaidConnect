import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { ClientInit } from "@/components/ClientInit";
import { QueryClientProvider } from "@/components/QueryClientProvider";
import { MessagesProvider } from "@/context/MessagesContext";

import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "AddisBroker - Real Estate Platform",
    template: "%s | AddisBroker",
  },
  description:
    "Find your dream property in Addis Ababa with trusted brokers. Browse apartments, houses, commercial spaces, and offices for rent or sale in Ethiopia's capital city.",
  keywords: [
    "Addis Ababa real estate",
    "property Ethiopia",
    "real estate platform",
    "property search Addis Ababa",
    "apartments for rent",
    "houses for sale",
    "commercial property",
    "office space",
    "real estate brokers",
    "property listings Ethiopia",
  ],
  authors: [{ name: "AddisBroker Team" }],
  creator: "AddisBroker",
  publisher: "AddisBroker",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://addisbroker.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://addisbroker.com",
    siteName: "AddisBroker",
    title: "AddisBroker - Real Estate Platform",
    description:
      "Find your dream property in Addis Ababa with trusted brokers. Browse apartments, houses, commercial spaces, and offices for rent or sale.",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "AddisBroker - Real Estate Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AddisBroker - Real Estate Platform",
    description:
      "Find your dream property in Addis Ababa with trusted brokers. Browse apartments, houses, commercial spaces, and offices for rent or sale.",
    images: ["/images/og-default.jpg"],
    creator: "@addisbroker",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
          defer
        />
        <Script id="onesignal-init">
          {`
            // Service Worker Registration
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function () {
                navigator.serviceWorker.register('/OneSignalSDKWorker.js')
                  .then(function (registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                  }, function (err) {
                    console.log('ServiceWorker registration failed: ', err);
                  });
              });
            }

            // OneSignal Initialization
            window.OneSignalDeferred = window.OneSignalDeferred || [];
            OneSignalDeferred.push(async function(OneSignal) {
              await OneSignal.init({
                appId: "85e54bff-47e7-4d4d-a0ec-baaacf438c45",
              });
            });
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryClientProvider>
            <MessagesProvider>
              <ClientInit />
              <Header />
              {children}
              <BottomNav />
              <Toaster />
            </MessagesProvider>
          </QueryClientProvider>
        </ThemeProvider>
        {/* <Script id="tawk-to">
          {`
            var Tawk_API = Tawk_API || {};
            
            Tawk_API.customStyle = {
              visibility : {
                desktop : {
                  position : 'br',
                  xOffset : '60px',
                  yOffset : 20
                },
                mobile : {
                  position : 'br',
                  xOffset : 0,
                  yOffset : 80
                },
                bubble : {
                  rotate : '0deg',
                  xOffset : -20,
                  yOffset : 0
                } 
              }
            };
            
            var Tawk_LoadStart=new Date();
            (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/689651f215ee5b1927ae1f77/1j25j6plu';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
            })();
          `}
        </Script> */}
      </body>
    </html>
  );
}

