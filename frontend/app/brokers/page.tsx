import { Suspense } from "react";
import { getApprovedBrokers } from "@/lib/data-service";
import { BrandLoader } from "@/components/ui/brand-loader";
import BrokersClient from "./brokers-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trusted Real Estate Brokers in Addis Ababa | AddisBroker",
  description:
    "Connect with verified and experienced real estate brokers in Addis Ababa. Find the best property professionals to help you buy, sell, or rent properties in Ethiopia's capital.",
  keywords: [
    "real estate brokers Addis Ababa",
    "property brokers Ethiopia",
    "real estate agents Addis Ababa",
    "property consultants Addis Ababa",
    "verified brokers Addis Ababa",
    "experienced brokers Ethiopia",
    "property professionals Addis Ababa",
    "real estate services Ethiopia",
    "broker directory Addis Ababa",
    "trusted brokers Ethiopia",
  ],
  openGraph: {
    title: "Trusted Real Estate Brokers in Addis Ababa | AddisBroker",
    description:
      "Connect with verified and experienced real estate brokers in Addis Ababa. Find the best property professionals to help you buy, sell, or rent properties.",
    type: "website",
    locale: "en_US",
    siteName: "AddisBroker",
    images: [
      {
        url: "/images/og-brokers.jpg",
        width: 1200,
        height: 630,
        alt: "Trusted Real Estate Brokers in Addis Ababa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trusted Real Estate Brokers in Addis Ababa | AddisBroker",
    description:
      "Connect with verified and experienced real estate brokers in Addis Ababa. Find the best property professionals to help you buy, sell, or rent properties.",
    images: ["/images/og-brokers.jpg"],
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
    canonical: "https://addisbroker.com/brokers",
  },
};

export default async function BrokersPage() {
  // Fetch brokers on the server
  const brokers = await getApprovedBrokers();
  console.log(brokers);

  return (
    <Suspense fallback={<BrandLoader />}>
      <BrokersClient initialBrokers={brokers} />
    </Suspense>
  );
}

