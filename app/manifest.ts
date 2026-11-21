import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Melandaha Live TV",
    short_name: "Melandaha TV",
    description: "বাংলাদেশের লাইভ টিভি, খবর ও বিনোদন",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#080d18",
    theme_color: "#080d18",
    lang: "bn",
    icons: [
      {
        src: "/melandaha-logo.png",
        sizes: "any",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
