import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/api/",
        "/profile",
        "/messages",
        "/properties/add",
        "/properties/request_property",
        "/forgot-password",
        "/reset-password",
        "/login",
        "/signup",
      ],
    },
    sitemap: "https://addisbroker.com/sitemap.xml",
  };
}
