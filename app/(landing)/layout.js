import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./landing-styles.css";

export default function LandingLayout({ children }) {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="grow">
        {children}
      </div>
      <Footer />
    </main>
  );
}
