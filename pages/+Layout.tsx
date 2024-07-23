import Footer from "@components/footer";
import Navbar from "@components/navbar";
import "@fontsource-variable/inter";
import "@/css/index.scss";
import "@/css/card.scss";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main className="min-h-screen relative mx-auto px-6 sm:px-12 lg:max-w-[70rem] xl:max-w-[76rem] 2xl:max-w-[92rem] text-white">
        <Navbar />
        {children}
      </main>
      <Footer />
    </>
  );
};

export default Layout;