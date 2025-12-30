import { Helmet, HelmetProvider } from "react-helmet-async";
import { personalData } from "@/utils/data/personal-data";
import Footer from "@components/footer";
import Navbar from "@components/navbar";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>{personalData.pageTitle}</title>
        <meta name="description" content={personalData.pageDescription} />
      </Helmet>
      <main className="min-h-screen relative mx-auto px-6 sm:px-12 lg:max-w-[70rem] xl:max-w-[76rem] 2xl:max-w-[92rem] text-white">
        <Navbar />
        {children}
      </main>
      <Footer />
    </HelmetProvider>
  );
};

export default RootLayout;
