import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Christmas Light Guys — Field Ops",
    short_name: "Lights Guys",
    description: "Schedule crews, route trucks, and run every install for a Christmas lights installation business.",
    start_url: "/",
    display: "standalone",
    background_color: "#FBF7F2",
    theme_color: "#C8102E",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
