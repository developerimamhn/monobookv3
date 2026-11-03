import { SiteMotion } from "@/components/motion/SiteMotion";
import { Contact } from "@/components/sections/Contact";
import { Deliverables } from "@/components/sections/Deliverables";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { MobileCta } from "@/components/sections/MobileCta";
import { Needs } from "@/components/sections/Needs";
import { Pace } from "@/components/sections/Pace";
import { Problem } from "@/components/sections/Problem";
import { Proof } from "@/components/sections/Proof";
import { Showcase } from "@/components/sections/Showcase";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Showcase />
        <Problem />
        <Deliverables />
        <Pace />
        <Needs />
        <Proof />
        <Contact />
      </main>
      <Footer />
      <MobileCta />
      <SiteMotion />
    </>
  );
}
