// import { Property } from "@/types";

// export const properties: Property[] = [
//   {
//     id: "68645c5a1df8d323cb2f251d",
//     title: "Modern Apartment",
//     description:
//       "A beautifully designed apartment located in the heart of the city with stunning views.",
//     price: 750000,
//     location: {
//       region: "Addis Ababa",
//       city: "Addis Ababa",
//       subCity: "Bole",
//       neighborhood: "Gerji",
//       coordinates: {
//         lat: 9.0108,
//         lng: 38.7613,
//       },
//     },
//     type: "apartment",
//     status: "Sold",
//     images: [
//       `${
//         process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL?.replace(/\/+$/, "") || ""
//       }/images/properties/modern-apartment-11.jpg`,
//       `${
//         process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL?.replace(/\/+$/, "") || ""
//       }/images/properties/modern-apartment-22.jpg`,
//       `${
//         process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL?.replace(/\/+$/, "") || ""
//       }/images/properties/modern-apartment-33.jpg`,
//       `${
//         process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL?.replace(/\/+$/, "") || ""
//       }/images/properties/modern-apartment-44.jpg`,
//       `${
//         process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL?.replace(/\/+$/, "") || ""
//       }/images/properties/modern-apartment-55.jpg`,
//       // `${
//       //   process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL?.replace(/\/+$/, "") || ""
//       // }/images/properties/modern-apartment-55.jpg`,
//       // `${
//       //   process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL?.replace(/\/+$/, "") || ""
//       // }/images/properties/modern-apartment-55.jpg`,
//       // `${
//       //   process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL?.replace(/\/+$/, "") || ""
//       // }/images/properties/modern-apartment-55.jpg`,
//       // `${
//       //   process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL?.replace(/\/+$/, "") || ""
//       // }/images/properties/modern-apartment-55.jpg`,
//     ],
//     listingType: "sale",
//     features: {
//       bedrooms: 3,
//       bathrooms: 2,
//       area: 120,
//       parking: true,
//     },
//     owner: {
//       id: "686775af53db77bf01c1895c",
//       name: "Eyob Yihalem",
//       email: "eyob@example.com",
//       role: "Broker",
//       phone: "+251912345678",
//       profilePhoto: "https://example.com/profiles/eyob.jpg",
//       createdAt: "2023-06-15T08:00:00Z",
//       isActive: true,
//       status: "approved",
//     },
//     viewedBy: ["64e3fa54e7fd9d001efcd9b2", "64e3fbbc874abc001fbbba90"],
//     views: 156,
//     rating: 4.5,
//     reviews: [
//       {
//         id: "68645c5a1df8d323cb2f251e",
//         userId: "64e3fa54e7fd9d001efcd9b2",
//         userName: "John Doe",
//         rating: 5,
//         comment: "Great apartment, very clean and modern.",
//         createdAt: "2024-01-15T08:00:00Z",
//       },
//       {
//         id: "68645c5a1df8d323cb2f251f",
//         userId: "64e3fbbc874abc001fbbba90",
//         userName: "Jane Smith",
//         rating: 4,
//         comment: "Loved the location but parking was a bit tight.",
//         createdAt: "2024-01-14T10:00:00Z",
//       },
//     ],
//     createdAt: "2025-07-01T22:05:58.265Z",
//     updatedAt: "2025-07-02T23:37:37.208Z",
//     moderationStatus: "approved",
//     isActive: true,
//   },
//   {
//     id: "1",
//     title: "Modern 2BR Apartment in Bole",
//     description: "Beautiful modern apartment with great amenities",
//     price: 800000,
//     location: {
//       region: "Addis Ababa",
//       city: "Addis Ababa",
//       subCity: "Bole",
//       neighborhood: "Bole Medhanialem",
//     },
//     type: "apartment",
//     status: "Active",
//     images: [
//       "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
//     ],
//     listingType: "sale",
//     features: {
//       bedrooms: 2,
//       bathrooms: 2,
//       area: 120,
//       parking: true,
//     },
//     owner: {
//       id: "1",
//       name: "John Broker",
//       email: "john@addisbroker.com",
//       role: "Broker",
//       phone: "+251911234567",
//       createdAt: "2023-06-15T08:00:00Z",
//       isActive: true,
//       status: "approved",
//     },
//     viewedBy: [],
//     views: 89,
//     rating: 4.5,
//     reviews: [],
//     createdAt: "2024-01-15T08:00:00Z",
//     updatedAt: "2024-01-15T08:00:00Z",
//     moderationStatus: "approved",
//     isActive: true,
//   },
//   {
//     id: "2",
//     title: "Luxury Villa in Old Airport",
//     description: "Spacious luxury villa with garden and pool",
//     price: 2500000,
//     location: {
//       region: "Addis Ababa",
//       city: "Addis Ababa",
//       subCity: "Bole",
//       neighborhood: "Old Airport",
//     },
//     type: "house",
//     status: "Active",
//     images: [
//       "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
//     ],
//     listingType: "sale",
//     features: {
//       bedrooms: 4,
//       bathrooms: 3,
//       area: 300,
//       parking: true,
//     },
//     owner: {
//       id: "2",
//       name: "Sarah Properties",
//       email: "sarah@addisbroker.com",
//       role: "Broker",

//       phone: "+251911234568",
//       createdAt: "2023-08-20T10:00:00Z",
//       isActive: true,
//       status: "approved",
//     },
//     viewedBy: [],
//     views: 234,
//     rating: 4.8,
//     reviews: [],
//     createdAt: "2024-01-14T10:00:00Z",
//     updatedAt: "2024-01-14T10:00:00Z",
//     moderationStatus: "approved",
//     isActive: true,
//   },
//   {
//     id: "3",
//     title: "Commercial Space in Piazza",
//     description: "Prime commercial location in the heart of Piazza",
//     price: 1200000,
//     location: {
//       region: "Addis Ababa",
//       city: "Addis Ababa",
//       subCity: "Arada",
//       neighborhood: "Piazza",
//     },
//     type: "commercial",
//     status: "Active",
//     images: [
//       "https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg",
//     ],
//     listingType: "sale",
//     features: {
//       area: 150,
//       parking: false,
//     },
//     owner: {
//       id: "3",
//       name: "Mike Real Estate",
//       email: "mike@addisbroker.com",
//       role: "Broker",
//       phone: "+251911234569",
//       createdAt: "2024-01-10T14:00:00Z",
//       isActive: true,
//       status: "approved",
//     },
//     viewedBy: [],
//     views: 67,
//     rating: 4.2,
//     reviews: [],
//     createdAt: "2024-01-13T14:00:00Z",
//     updatedAt: "2024-01-13T14:00:00Z",
//     moderationStatus: "approved",
//     isActive: true,
//   },
// ];

