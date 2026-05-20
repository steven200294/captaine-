import Hero from "@/components/Hero";
import FeaturesCarouselSection from "@/components/FeaturesCarouselSection";
import OffersSection from "@/components/OffersSection";
import TestimonialMapSection from "@/components/TestimonialMapSection";
import ClientReviewsSection from "@/components/ClientReviewsSection";
import AccessMapSection from "@/components/AccessMapSection";

export default function Home() {
  return (
    <>
      <Hero />
      <OffersSection />
      <FeaturesCarouselSection />
      <TestimonialMapSection />
      <ClientReviewsSection />
      <AccessMapSection />
    </>
  );
}
