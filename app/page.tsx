import { Contact } from "@/components/sections/Contact";
import { Deliverables } from "@/components/sections/Deliverables";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Needs } from "@/components/sections/Needs";
import { Pace } from "@/components/sections/Pace";
import { Problem } from "@/components/sections/Problem";
import { Showcase } from "@/components/sections/Showcase";
import { Proof } from "@/components/sections/Proof";

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
    </>
  );
}
