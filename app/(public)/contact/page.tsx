import Hero from "@/components/contact/hero";
import ContactForm from "@/components/contact/contactForm";
import ContactInfo from "@/components/contact/info";
import Map from "@/components/contact/Map";
import Script from "next/script";

export const dynamic = "force-static";

export const metadata = {
  title: "Contact As FitnessZone | Unisex Gym in Bolpur",
  description:
    "Contact As FitnessZone, the best unisex gym in Bolpur. Call or visit us today for membership and fitness programs.",
};

export default function ContactPage() {
  return (
    <>
      {/* Contact Page Schema */}
      <Script
        id="as-fitnesszone-contact-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact As FitnessZone",
            areaServed: {
              "@type": "Place",
              name: "Bolpur",
            },
          }),
        }}
      />

      <div className="min-h-screen flex flex-col">
        <main>
          <Hero />
          <ContactForm />
          <ContactInfo />
          <Map />
        </main>
      </div>
    </>
  );
}
