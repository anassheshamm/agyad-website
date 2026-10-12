import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import HeroSection from "../components/sections/HeroSection";
import AboutSection from "../components/sections/AboutSection";
import ServicesSection from "../components/sections/ServicesSection";
import GallerySection from "../components/sections/GallerySection";
import ProjectsSection from "../components/sections/ProjectsSection";
import ContactSection from "../components/sections/ContactSection";
import PartnersSection from "../components/sections/PartnersSection";

export default function Home() {
  return (
    <>
    <div >
      <Navbar />

      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <GallerySection />
      <ProjectsSection />
      <PartnersSection />
      <ContactSection />

      <Footer /> 
      </div>
    </>
  );
}
