import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import SeaBlock from '../components/SeaBlock';
import FeaturedDishes from '../components/FeaturedDishes';
import MenuSection from '../components/MenuSection';
import Gallery from '../components/Gallery';
import Banquets from '../components/Banquets';
import Reviews from '../components/Reviews';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal';
import { useModal } from '../hooks/useModal';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function KinzaSite() {
  const modal = useModal();
  useScrollAnimation();

  return (
    <div className="min-h-screen bg-cream">
      <Header onBook={modal.open} />
      <main>
        <Hero onBook={modal.open} />
        <About />
        <SeaBlock />
        <FeaturedDishes />
        <MenuSection />
        <Gallery />
        <Banquets />
        <Reviews />
        <Contact onBook={modal.open} />
      </main>
      <Footer />
      <BookingModal isOpen={modal.isOpen} onClose={modal.close} />
      <button
        onClick={modal.open}
        className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 btn-terra shadow-2xl shadow-black/30 px-8 py-4"
      >
        Забронировать стол
      </button>
    </div>
  );
}