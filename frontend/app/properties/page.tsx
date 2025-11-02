import { Suspense } from "react";
import { getApprovedProperties } from "@/lib/data-service";
import { BrandLoader } from "@/components/ui/brand-loader";
import PropertiesClient from "./properties-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Properties for Rent & Sale in Addis Ababa | AddisBroker",
  description:
    "Browse thousands of properties for rent and sale in Addis Ababa. Find apartments, houses, commercial spaces, and offices with detailed information, photos, and contact details.",
  keywords: [
    "properties Addis Ababa",
    "apartments for rent Addis Ababa",
    "houses for sale Addis Ababa",
    "commercial property Addis Ababa",
    "office space Addis Ababa",
    "property listings Ethiopia",
    "real estate Addis Ababa",
    "rent property Addis Ababa",
    "buy property Addis Ababa",
    "Bole apartments",
    "Gerji houses",
    "Cazanchise commercial",
  ],
  openGraph: {
    title: "Properties for Rent & Sale in Addis Ababa | AddisBroker",
    description:
      "Browse thousands of properties for rent and sale in Addis Ababa. Find apartments, houses, commercial spaces, and offices with detailed information.",
    type: "website",
    locale: "en_US",
    siteName: "AddisBroker",
    images: [
      {
        url: "/images/og-properties.jpg",
        width: 1200,
        height: 630,
        alt: "Properties for Rent & Sale in Addis Ababa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Properties for Rent & Sale in Addis Ababa | AddisBroker",
    description:
      "Browse thousands of properties for rent and sale in Addis Ababa. Find apartments, houses, commercial spaces, and offices.",
    images: ["/images/og-properties.jpg"],
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
  alternates: {
    canonical: "https://addisbroker.com/properties",
  },
};

export default async function PropertiesPage() {
  // Fetch properties on the server
  const properties = await getApprovedProperties();
  console.log(properties);

  return (
    <Suspense fallback={<BrandLoader />}>
      <PropertiesClient initialProperties={properties} />
    </Suspense>
  );
}

