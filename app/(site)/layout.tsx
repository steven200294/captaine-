import TopBanner from "@web/components/TopBanner";
import Header from "@web/components/Header";
import Footer from "@web/components/Footer";
import AIWidget from "@web/components/ai/AIWidget";
import Providers from "@web/components/Providers";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="fixed top-0 left-0 right-0 z-50">
        <TopBanner />
        <Header />
      </div>
      <main className="flex-1 pt-[100px] sm:pt-[108px] lg:pt-[124px]">
        {children}
      </main>
      <Footer />
      <AIWidget />
    </Providers>
  );
}
