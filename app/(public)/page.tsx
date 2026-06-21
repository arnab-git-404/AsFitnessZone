import Hero from "@/components/home/Hero";
import Why from "@/components/home/Why";
import Stats from "@/components/home/Stats";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";

export const dynamic = "force-static";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main>
        <Hero />
        <Why />
        <Stats />
        <Testimonials />
        <CTA />
      </main>
    </div>
  );
}
