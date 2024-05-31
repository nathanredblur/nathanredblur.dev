import HeroSection from "@components/homepage/hero-section";
import AboutSection from "@components/homepage/about";
import Experience from "@components/homepage/experience";
import Skills from "@components/homepage/skills";
import Projects from "@components/homepage/projects";
import ContactSection from "@/components/homepage/contact";
// import Education from "@components/homepage/education";

const Home = () => {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <Experience />
      <Skills />
      <Projects />
      <ContactSection />
      {/* <Education /> */}
    </>
  );
};

export default Home;
