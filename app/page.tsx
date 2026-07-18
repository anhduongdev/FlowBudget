import { FinalCta } from "@/app/_components/FinalCta";
import { Footer } from "@/app/_components/Footer";
import { Features } from "@/app/_components/Features";
import { Hero } from "@/app/_components/Hero";
import { Nav } from "@/app/_components/Nav";
import { Pricing } from "@/app/_components/Pricing";
import { ProblemSolution } from "@/app/_components/ProblemSolution";
import { ScrollReveal } from "@/app/_components/ScrollReveal";
import { SocialProof } from "@/app/_components/SocialProof";
import { VisualHighlights } from "@/app/_components/VisualHighlights";

export default function Home() {
  return (
    <>
      <ScrollReveal />
      <Nav />
      <Hero />
      <SocialProof />
      <ProblemSolution />
      <Features />
      <VisualHighlights />
      <Pricing />
      <FinalCta />
      <Footer />
    </>
  );
}
