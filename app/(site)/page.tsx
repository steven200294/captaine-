import Hero from "@web/components/Hero";
import FeaturesCarouselSection from "@web/components/FeaturesCarouselSection";
import OffersSection from "@web/components/OffersSection";
import TestimonialMapSection from "@web/components/TestimonialMapSection";
import ClientReviewsSection from "@web/components/ClientReviewsSection";
import AccessMapSection from "@web/components/AccessMapSection";

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
