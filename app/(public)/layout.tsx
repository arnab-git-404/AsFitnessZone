import Footer from "@/components/public/Footer";
import Navbar from "@/components/public/Navbar";
import BackToTop from "@/components/ui/BackToTop";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Navbar />
      {children}
      <Footer />
      <BackToTop />
    </main>
  );
}
