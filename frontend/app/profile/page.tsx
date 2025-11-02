import { ProfileContent } from "@/components/profile/profile-content";
import { BrandLoader } from "@/components/ui/brand-loader";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile - Manage Your Account | AddisBroker",
  description:
    "Manage your AddisBroker profile, view your properties, upgrade to broker status, and access your account settings. Join thousands of users finding their perfect property in Addis Ababa.",
  keywords: [
    "profile AddisBroker",
    "account management Ethiopia",
    "upgrade to broker",
    "user profile Addis Ababa",
    "property management Ethiopia",
    "real estate account",
    "broker upgrade Ethiopia",
    "user dashboard AddisBroker",
  ],
  openGraph: {
    title: "My Profile - Manage Your Account | AddisBroker",
    description:
      "Manage your AddisBroker profile, view your properties, upgrade to broker status, and access your account settings.",
    type: "website",
    locale: "en_US",
    siteName: "AddisBroker",
    images: [
      {
        url: "/images/og-profile.jpg",
        width: 1200,
        height: 630,
        alt: "AddisBroker Profile Management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Profile - Manage Your Account | AddisBroker",
    description:
      "Manage your AddisBroker profile, view your properties, upgrade to broker status, and access your account settings.",
    images: ["/images/og-profile.jpg"],
  },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://addisbroker.com/profile",
  },
};

export default function ProfilePage() {
  return (
    <Suspense fallback={<BrandLoader />}>
      <ProfileContent />
    </Suspense>
  );
}

