import { notFound } from "next/navigation";
import { BrokerDetail } from "@/components/broker/broker-detail";
import { getBrokerById } from "@/lib/data-service";
import type { Metadata } from "next";

interface BrokerDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: BrokerDetailPageProps): Promise<Metadata> {
  const broker = await getBrokerById(params.id);

  if (!broker) {
    return {
      title: "Broker Not Found | AddisBroker",
      description: "The requested broker profile could not be found.",
    };
  }

  return {
    title: `${broker.name} - Real Estate Broker in Addis Ababa | AddisBroker`,
    description: `Connect with ${
      broker.name
    }, a trusted real estate broker in Addis Ababa. ${
      broker.description ||
      `Specializing in ${
        broker.specialties?.join(", ") || "various property types"
      }.`
    } View properties and contact information.`,
    keywords: [
      `${broker.name} broker`,
      `real estate broker ${broker.name}`,
      "Addis Ababa broker",
      "property broker Ethiopia",
      ...(broker.specialties || []).map(
        (specialty) => `${specialty} broker Addis Ababa`
      ),
      "verified broker Ethiopia",
      "experienced broker Addis Ababa",
    ],
    openGraph: {
      title: `${broker.name} - Real Estate Broker in Addis Ababa | AddisBroker`,
      description: `Connect with ${
        broker.name
      }, a trusted real estate broker in Addis Ababa. ${
        broker.description ||
        `Specializing in ${
          broker.specialties?.join(", ") || "various property types"
        }.`
      }`,
      type: "profile",
      locale: "en_US",
      siteName: "AddisBroker",
      images: broker.profilePhoto
        ? [
            {
              url: broker.profilePhoto,
              width: 400,
              height: 400,
              alt: `${broker.name} - Real Estate Broker`,
            },
          ]
        : [
            {
              url: "/images/og-broker-default.jpg",
              width: 400,
              height: 400,
              alt: `${broker.name} - Real Estate Broker`,
            },
          ],
    },
    twitter: {
      card: "summary",
      title: `${broker.name} - Real Estate Broker in Addis Ababa | AddisBroker`,
      description: `Connect with ${broker.name}, a trusted real estate broker in Addis Ababa.`,
      images: broker.profilePhoto
        ? [broker.profilePhoto]
        : ["/images/og-broker-default.jpg"],
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
      canonical: `https://addisbroker.com/brokers/${params.id}`,
    },
  };
}

export default async function BrokerDetailPage({
  params,
}: BrokerDetailPageProps) {
  const broker = await getBrokerById(params.id);

  if (!broker) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="pb-20">
        <BrokerDetail broker={broker} properties={broker.properties} />
      </main>
    </div>
  );
}

