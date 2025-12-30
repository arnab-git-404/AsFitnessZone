import Hero from "@/components/home/Hero";
import Why from "@/components/home/Why";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";

export const dynamic = "force-static";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main>
        <Hero />
        <Why />
        <Testimonials />
        <CTA />
      </main>
    </div>
  );
}
