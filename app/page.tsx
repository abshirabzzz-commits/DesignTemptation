import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProjectShowcase } from "@/components/ProjectShowcase";
import { AboutPreview } from "@/components/AboutPreview";
import { StatsSection } from "@/components/StatsSection";
import { ServicesPreview } from "@/components/ServicesPreview";
import { ProcessSection } from "@/components/ProcessSection";
import { CalculatorCTA } from "@/components/CalculatorCTA";
import { BeforeAfter } from "@/components/BeforeAfter";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { FAQPreview } from "@/components/FAQPreview";
import { FinalCTA } from "@/components/FinalCTA";
import { MovingReviews } from "@/components/MovingReviews";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#171615] overflow-x-hidden">
      {/* 1. Header Navigation */}
      <Header />

      <main className="flex-1">
        {/* 2. Hero (Strongest) */}
        <Hero />

        {/* 3. Selected Projects (Strong but balanced editorial grid) */}
        <ProjectShowcase />

        {/* 4. Studio / About (Medium) */}
        <AboutPreview />

        {/* 5. Stats / Countdown (Compact) */}
        <StatsSection />

        {/* 6. Services (Medium) */}
        <ServicesPreview />

        {/* 7. Process of Service (Medium) */}
        <ProcessSection />

        {/* 8. Before / After Showcase (Medium/Strong) */}
        <BeforeAfter />

        {/* 9. Featured Products (Compact) */}
        <FeaturedProducts />

        {/* 10. Cost Calculator Teaser (Compact) */}
        <CalculatorCTA />

        {/* 10. FAQ (Light) */}
        <FAQPreview />

        {/* 11. Final CTA (Medium) */}
        <FinalCTA />

        {/* 12. Moving Reviews (Strong finishing section placed directly above Footer) */}
        <MovingReviews />
      </main>

      {/* 13. Footer */}
      <Footer />
    </div>
  );
}
