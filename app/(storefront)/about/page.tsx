import Hero from "@/components/storefront/about/Hero";
import Story from "@/components/storefront/about/Story";
import Timeline from "@/components/storefront/about/Timeline";
import Craftsmanship from "@/components/storefront/about/Craftsmanship";
import Materials from "@/components/storefront/about/Materials";
import Studio from "@/components/storefront/about/Studio";
import Values from "@/components/storefront/about/Values";
import Stats from "@/components/storefront/about/Stats";
import CTA from "@/components/storefront/about/CTA";

export const metadata = {
  title: "About | LUMINA Atelier",
  description:
    "The story, craftsmanship, and values behind Lumina — a luxury furniture atelier founded in Lahore, Pakistan.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--lm-surface-primary)]">
      <Hero />
      <Story />
      <Timeline />
      <Craftsmanship />
      <Materials />
      <Studio />
      <Values />
      <Stats />
      <CTA />
    </div>
  );
}