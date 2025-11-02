import { Suspense, useEffect } from "react";
import { HeroSection } from "@/components/home/hero-section";
import NewstProperties from "@/components/home/NewstProperties";
import MostViewedProperties from "@/components/home/MostViewedProperties";
import MostRatedProperties from "@/components/home/MostRatedProperties";
import NewestBrokers from "@/components/home/NewestBrokers";
import MostRatedBrokers from "@/components/home/MostRatedBrokers";
import { BrandLoader } from "@/components/ui/brand-loader";
import type { Metadata } from "next";

// export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AddisBroker - Find Your Dream Property in Addis Ababa",
  description:
    "Discover the best properties in Addis Ababa with AddisBroker. Browse apartments, houses, commercial spaces, and offices for rent or sale. Connect with trusted brokers and find your perfect home.",
  keywords: [
    "Addis Ababa real estate",
    "property for rent Addis Ababa",
    "property for sale Addis Ababa",
    "apartments Addis Ababa",
    "houses Addis Ababa",
    "commercial property Addis Ababa",
    "office space Addis Ababa",
    "real estate broker Addis Ababa",
    "property search Ethiopia",
    "Bole property",
    "Gerji property",
    "Cazanchise property",
  ],
  openGraph: {
    title: "AddisBroker - Find Your Dream Property in Addis Ababa",
    description:
      "Discover the best properties in Addis Ababa with AddisBroker. Browse apartments, houses, commercial spaces, and offices for rent or sale.",
    type: "website",
    locale: "en_US",
    siteName: "AddisBroker",
    images: [
      {
        url: "/images/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "AddisBroker - Real Estate Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AddisBroker - Find Your Dream Property in Addis Ababa",
    description:
      "Discover the best properties in Addis Ababa with AddisBroker. Browse apartments, houses, commercial spaces, and offices for rent or sale.",
    images: ["/images/og-home.jpg"],
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
    canonical: "https://addisbroker.com",
  },
};

export default function Home() {
  // const {
  //   newProperties,
  //   mostRatedProperties,
  //   mostViewedProperties,
  //   isLoading: propertiesLoading,
  //   fetchProperties,
  // } = usePropertiesStore();

  // const {
  //   newBrokers,
  //   mostReviewedBrokers,
  //   isLoading: brokersLoading,
  //   fetchBrokers,
  // } = useBrokersStore();

  return (
    <div className="min-h-screen bg-background">
      {/* <Header /> */}

      <main>
        <HeroSection />
        <Suspense fallback={<BrandLoader />}>
          <NewstProperties />
        </Suspense>
        <Suspense fallback={<BrandLoader />}>
          <MostRatedProperties />
        </Suspense>
        <Suspense fallback={<BrandLoader />}>
          <MostViewedProperties />
        </Suspense>

        <Suspense fallback={<BrandLoader />}>
          <NewestBrokers />
        </Suspense>
        <Suspense fallback={<BrandLoader />}>
          <MostRatedBrokers />
        </Suspense>
      </main>

      {/* <BottomNav /> */}
    </div>
  );
}

