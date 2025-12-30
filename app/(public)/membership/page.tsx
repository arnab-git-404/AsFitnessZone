import Price from "@/components/membership/Price";
import FAQ from "@/components/membership/FAQ";
import { Check } from "lucide-react";

export const dynamic = "force-static";


export const metadata = {
  title: "Gym Membership Plans in Bolpur",
  description:
    "Affordable gym membership plans at As FitnessZone – best unisex gym in Bolpur.",
};



export default function MembershipPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-background via-background to-primary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold">
                Choose Your <span className="text-primary">Membership</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Flexible plans designed to fit your lifestyle and budget
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <Price />

        {/* Features Comparison */}
        {/* <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">
                  All Plans <span className="text-primary">Include</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  "State-of-the-art equipment",
                  "Clean locker rooms & showers",
                  "Free parking",
                  "Climate-controlled facility",
                  "Professional staff support",
                  "Progress tracking tools",
                  "Member mobile app",
                  "Community events",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section> */}

        {/* FAQ Section */}
        <FAQ />
      </main>
    </div>
  );
}
