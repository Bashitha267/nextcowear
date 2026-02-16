import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, ChevronLeft, ChevronRight, Quote, Plus, Feather, Scissors, Leaf } from "lucide-react";
import TestimonialsDrawer from "@/components/TestimonialsDrawer";
import BestSellersSection from "@/components/BestSellersSection";
import NewArrivalsSection from "@/components/NewArrivalsSection";
import FAQSection from "@/components/FAQSection";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import { getBestSellers, getFeaturedReviews, getSiteReviews, getNewArrivals, getFAQs } from "@/lib/api";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const bestSellers = await getBestSellers(100); // Increased limit to ensure we get enough products for all categories
  const newArrivals = await getNewArrivals(8);
  const reviews = await getFeaturedReviews(9); // Fetch more reviews for carousel
  const faqs = await getFAQs();

  // Fetch total count of approved reviews
  const { count: totalReviews } = await supabase
    .from('site_reviews')
    .select('*', { count: 'exact', head: true })
    .eq('is_approved', true);

  return (
    <div className="relative min-h-screen bg-[#FDFBF7] pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden py-12 lg:py-0 bg-gold-50/20 lg:px-20">
        <div className="w-full px-4 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center z-10">
          <div className="order-2 lg:order-1">
            <span className="inline-block text-gold-600 font-medium tracking-[0.3em] uppercase mb-4 animate-in fade-in slide-in-from-bottom duration-700">
              Sri Lankan Heritage 2026
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-gray-900 leading-tight mb-6 animate-in fade-in slide-in-from-bottom duration-1000">
              Island Elegance, <br />
              <span className="bg-linear-to-r from-gold-400 via-gold-600 to-gold-400 bg-clip-text text-transparent">Everyday</span> Style
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
              Discover the best cloths, meticulously tailed for comfort and sophistication. Experience the authentic touch of luxury.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
              <Link
                href="/collections"
                className="bg-gold-500 text-white px-8 py-4 rounded-sm font-medium tracking-widest uppercase hover:bg-gold-600 transition-all flex items-center justify-center gap-2 group"
              >
                Shop Now
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="border border-gray-200 bg-white text-gray-900 px-8 py-4 rounded-sm font-medium tracking-widest uppercase hover:border-gold-500 hover:text-gold-500 transition-all flex items-center justify-center"
              >
                Our Story
              </Link>
            </div>
          </div>
          <div className="relative order-1 lg:order-2 animate-in fade-in zoom-in duration-1000">
            <div className="relative w-full h-[80vh] rounded-sm overflow-hidden border-12 border-gold-50">
              <Image
                src="https://res.cloudinary.com/dnfbik3if/image/upload/v1770442924/tshirt_vp2ngs.jpg"
                alt="Premium Cloth"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 border-l border-b border-gold-400"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 border-r border-t border-gold-400"></div>
          </div>
        </div>

        {/* Background text decoration */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.06] text-[20vw] font-serif font-bold whitespace-nowrap rotate-90 translate-x-1/2 text-gold-500">
          DRESSCO
        </div>
        <div className="absolute left-0 top-[20%] select-none pointer-events-none opacity-[0.03] text-[15vw] font-serif font-bold whitespace-nowrap text-gold-700">
          PREMIUM
        </div>

        {/* Testimonials Drawer Trigger */}
        <TestimonialsDrawer />
      </section>

      {/* Gender Selection Section */}
      <section className="py-12 bg-gold-50/20">
        <div className="w-full px-4 md:px-10 grid grid-cols-1 lg:grid-cols-3 gap-3 leading-none">
          {/* Women's Card */}
          <div className="relative aspect-[4/5] md:aspect-auto md:h-[80vh] overflow-hidden group border-2 border-gold-100/50 hover:border-gold-300 transition-colors duration-500">
            <Image
              src="https://res.cloudinary.com/dnfbik3if/image/upload/v1770443016/pro_stuf7a.jpg"
              alt="Women's Collection"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110 brightness-50"
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/15 transition-colors duration-500"></div>
            <div className="absolute bottom-12 left-8 md:left-12 right-8 text-white z-10">
              <span className="block text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase mb-4 text-gold-200">
                100% Premium Sri Lankan-Crafted and imported clothing for Women
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-8 leading-tight uppercase font-bold tracking-wider">
                Sustainably Made In <br /> <span className="text-gold-300">Sri Lanka</span>
              </h2>
              <Link
                href="/collections?category=Women"
                className="inline-block bg-white text-gray-900 border border-transparent px-8 md:px-12 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-gold-500 hover:text-white transition-all shadow-xl"
              >
                Shop Women
              </Link>
            </div>
            {/* Gold Corner Design */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-20 pointer-events-none overflow-hidden">
              <div className="absolute top-0 right-0 w-[200%] h-[200%] border-t-2 border-r-2 border-gold-500 rotate-45 transform translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>

          {/* Men's Card */}
          <div className="relative aspect-[4/5] md:aspect-auto md:h-[80vh] overflow-hidden group border-2 border-gold-100/50 hover:border-gold-300 transition-colors duration-500">
            <Image
              src="https://res.cloudinary.com/dnfbik3if/image/upload/v1770443139/Black_Modern_Fashion_Magazine_Cover_dowh0p.jpg"
              alt="Men's Collection"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/15 transition-colors duration-500"></div>
            <div className="absolute bottom-12 left-8 md:left-12 right-8 text-white z-10">
              <span className="block text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase mb-4 text-gold-200">
                100% Premium Sri Lankan-Crafted and imported clothing for Men
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-8 leading-tight uppercase font-bold tracking-wider">
                Expertly Crafted In <br /> <span className="text-gold-400">Sri Lanka</span>
              </h2>
              <Link
                href="/collections?category=Men"
                className="inline-block bg-white text-gray-900 border border-transparent px-8 md:px-12 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-gold-500 hover:text-white transition-all shadow-xl"
              >
                Shop Men
              </Link>
            </div>
            {/* Gold Corner Design */}
            <div className="absolute top-0 left-0 w-32 h-32 opacity-20 pointer-events-none overflow-hidden">
              <div className="absolute top-0 left-0 w-[200%] h-[200%] border-t-2 border-l-2 border-gold-500 -rotate-45 transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>

          {/* Kids' Card */}
          <div className="relative aspect-[4/5] md:aspect-auto md:h-[80vh] overflow-hidden group border-2 border-gold-100/50 hover:border-gold-300 transition-colors duration-500">
            <Image
              src="https://res.cloudinary.com/dxoa3ashm/image/upload/v1770459423/Peach_Minimalist_Kids_Fashion_Instagram_Post_nt29gy.jpg"
              alt="Kids' Collection"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110 brightness-50"
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/15 transition-colors duration-500"></div>
            <div className="absolute bottom-12 left-8 md:left-12 right-8 text-white z-10">
              <span className="block text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase mb-4 text-gold-200">
                100% Premium Sri Lankan-Crafted and imported clothing for Kids
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-8 leading-tight uppercase font-bold tracking-wider">
                Playfully Made In <br /> <span className="text-gold-400">Sri Lanka</span>
              </h2>
              <Link
                href="/collections?category=Kids"
                className="inline-block bg-white text-gray-900 border border-transparent px-8 md:px-12 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-gold-500 hover:text-white transition-all shadow-xl"
              >
                Shop Kids
              </Link>
            </div>
            {/* Gold Corner Design */}
            <div className="absolute bottom-0 right-0 w-32 h-32 opacity-20 pointer-events-none overflow-hidden">
              <div className="absolute bottom-0 right-0 w-[200%] h-[200%] border-b-2 border-r-2 border-gold-500 -rotate-45 transform translate-x-1/2 translate-y-1/2"></div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <NewArrivalsSection products={newArrivals} />

      {/* Best Selling Section */}
      <BestSellersSection products={bestSellers} />

      {/* Reviews Section */}
      <ReviewsCarousel initialReviews={reviews || []} totalReviews={totalReviews || 0} />

      {/* FAQ Section */}
      <FAQSection faqs={faqs} />

      {/* Trust bar */}
      <section className="py-24 bg-gold-50/80 relative overflow-hidden">
        <div className="w-full px-4 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-10 text-center relative z-10">
          <div className="flex flex-col items-center group">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-6 shadow-lg border border-gold-100 group-hover:bg-gold-500 transition-all duration-500">
              <Feather className="text-gold-600 group-hover:text-white transition-colors" size={36} strokeWidth={1} />
            </div>
            <h3 className="text-2xl md:text-3xl font-serif mb-3 text-gray-900 group-hover:text-gold-700 transition-colors">Superior Fabric Selection</h3>
            <p className="text-gold-600 tracking-wide text-[11px] font-bold italic">Premium Sri Lankan-crafted and imported clothing</p>
          </div>
          <div className="flex flex-col items-center group">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-6 shadow-lg border border-gold-100 group-hover:bg-gold-500 transition-all duration-500">
              <Scissors className="text-gold-600 group-hover:text-white transition-colors" size={36} strokeWidth={1} />
            </div>
            <h3 className="text-2xl md:text-3xl font-serif mb-3 text-gray-900 group-hover:text-gold-700 transition-colors">Master Craftsmanship</h3>
            <p className="text-gold-600 tracking-widest text-[11px] font-bold italic">Skill You Can Feel</p>
          </div>
          <div className="flex flex-col items-center group">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-6 shadow-lg border border-gold-100 group-hover:bg-gold-500 transition-all duration-500">
              <Leaf className="text-gold-600 group-hover:text-white transition-colors" size={36} strokeWidth={1} />
            </div>
            <h3 className="text-2xl md:text-3xl font-serif mb-3 text-gray-900 group-hover:text-gold-700 transition-colors">Refined Finishing</h3>
            <p className="text-gold-600 tracking-widest text-[11px] font-bold italic">Every Detail Perfected</p>
          </div>
        </div>
      </section>

      {/* Why Premium Fabric Section */}
      <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
        <Image
          src="https://res.cloudinary.com/dnfbik3if/image/upload/v1770443694/Brown_Minimalist_Fashion_Facebook_Cover_edhreh.jpg"
          alt="Premium Fabric Background"
          fill
          className="object-cover opacity-90 brightness-50"
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-xs md:text-sm font-bold tracking-[0.4em] uppercase mb-8">
            Why Premium Fabric?
          </h2>
          <p className="text-lg md:text-2xl font-light leading-relaxed mb-12 opacity-90">
            DressCo was founded to redefine the fashion industry in Sri Lanka by creating ethically
            made luxury essentials. We are proud to present our range of Premium Fabrics, meticulously crafted for the conscious individual who
            values quality above all else.
          </p>
          <Link
            href="/our-story"
            className="inline-block text-xs font-bold tracking-[0.3em] uppercase border-b-2 border-white pb-2 hover:text-gold-300 hover:border-gold-300 transition-all"
          >
            Discover More
          </Link>
        </div>
      </section>


    </div>
  );
}

