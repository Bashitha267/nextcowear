import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, ChevronLeft, ChevronRight, Quote, Plus, Feather, Scissors, Leaf } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden py-12 lg:py-0 bg-gold-50/40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
          <div className="order-2 lg:order-1">
            <span className="inline-block text-gold-600 font-medium tracking-[0.3em] uppercase mb-4 animate-in fade-in slide-in-from-bottom duration-700">
              Sri Lankan Heritage 2026
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-gray-900 leading-tight mb-6 animate-in fade-in slide-in-from-bottom duration-1000">
              Island Elegance, <br />
              <span className="bg-linear-to-r from-gold-400 via-gold-600 to-gold-400 bg-clip-text text-transparent">Everyday</span> Style
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
              Discover the finest Sri Lankan cotton Cloths, meticulously crafted for comfort and sophistication. Experience the authentic touch of our island's luxury.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
              <Link
                href="/shop"
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
            <div className="relative w-full aspect-4/5 rounded-sm overflow-hidden border-12 border-gold-50">
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
      </section>

      {/* Gender Selection Section */}
      <section className="py-12 bg-gold-50/20">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 leading-none">
          {/* Women's Card */}
          <div className="relative aspect-4/5 md:aspect-auto md:h-[80vh] overflow-hidden group border-2 border-gold-100/50 hover:border-gold-300 transition-colors duration-500">
            <Image
              src="https://res.cloudinary.com/dnfbik3if/image/upload/v1770443016/pro_stuf7a.jpg"
              alt="Women's Collection"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110 brightness-50"
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/15 transition-colors duration-500"></div>
            <div className="absolute bottom-12 left-8 md:left-12 right-8 text-white z-10">
              <span className="block text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase mb-4 text-gold-200">
                100% Organic Cotton Cloths for Women
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-8 leading-tight uppercase font-bold tracking-wider">
                Sustainably Made In <br /> <span className="text-gold-300">Sri Lanka</span>
              </h2>
              <Link
                href="/women"
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
          <div className="relative aspect-4/5 md:aspect-auto md:h-[80vh] overflow-hidden group border-2 border-gold-100/50 hover:border-gold-300 transition-colors duration-500">
            <Image
              src="https://res.cloudinary.com/dnfbik3if/image/upload/v1770443139/Black_Modern_Fashion_Magazine_Cover_dowh0p.jpg"
              alt="Men's Collection"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/15 transition-colors duration-500"></div>
            <div className="absolute bottom-12 left-8 md:left-12 right-8 text-white z-10">
              <span className="block text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase mb-4 text-gold-200">
                100% Organic Cotton Cloths for Men
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-8 leading-tight uppercase font-bold tracking-wider">
                Expertly Crafted In <br /> <span className="text-gold-400">Sri Lanka</span>
              </h2>
              <Link
                href="/men"
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
        </div>
      </section>

      {/* Best Selling Section */}
      <section className="py-20 bg-gold-50">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-gray-500 mb-6 block">
              Discover Our Best Selling Collection
            </span>
            <div className="flex justify-center gap-12 border-b border-gold-200/50 pb-px">
              <button className="text-sm font-bold tracking-[0.2em] uppercase py-4 border-b-2 border-gold-500 text-gold-600 transition-all">
                For Women
              </button>
              <button className="text-sm font-bold tracking-[0.2em] uppercase py-4 text-gray-400 hover:text-gold-500 transition-all">
                For Men
              </button>
            </div>
          </div>

          <div className="relative group">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {/* Product 1 */}
              <div className="flex flex-col">
                <div className="relative aspect-4/5 overflow-hidden mb-6 group/item border border-gold-50 hover:border-gold-300 transition-all duration-300">
                  <Image
                    src="https://res.cloudinary.com/dnfbik3if/image/upload/v1770443016/pro_stuf7a.jpg"
                    alt="Product 1"
                    fill
                    className="object-cover transition-transform duration-500 group-hover/item:scale-105"
                  />
                  <span className="absolute top-2 left-2 bg-gold-600 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 shadow-sm">
                    Best Seller
                  </span>
                  <button className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-sm shadow-sm opacity-0 translate-y-2 group-hover/item:opacity-100 group-hover/item:translate-y-0 transition-all hover:bg-gold-500 hover:text-white">
                    <Plus size={18} />
                  </button>
                </div>
                <div className="text-center">
                  <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-2 text-gray-900">
                    Womens 3/4 Sleeve Crew Neck
                  </h3>
                  <div className="text-gray-500 text-xs mb-4 font-medium tracking-wider">
                    RS 28,600
                  </div>
                  <div className="flex justify-center gap-1.5 mb-4">
                    <span className="w-3.5 h-3.5 rounded-full border border-gray-200 bg-white"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-gray-900"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-800"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-800"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-purple-800"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-yellow-400"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-red-600"></span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-gold-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} className="fill-current" />
                    ))}
                    <span className="text-[10px] font-medium text-gray-400 ml-1">(5.0)</span>
                  </div>
                </div>
              </div>

              {/* Product 2 */}
              <div className="flex flex-col">
                <div className="relative aspect-4/5 overflow-hidden mb-6 group/item border border-gold-50 hover:border-gold-300 transition-all duration-300">
                  <Image
                    src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000"
                    alt="Product 2"
                    fill
                    className="object-cover transition-transform duration-500 group-hover/item:scale-105"
                  />
                  <span className="absolute top-2 left-2 bg-gold-600 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 shadow-sm">
                    Best Seller
                  </span>
                  <button className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-sm shadow-sm opacity-0 translate-y-2 group-hover/item:opacity-100 group-hover/item:translate-y-0 transition-all hover:bg-gold-500 hover:text-white">
                    <Plus size={18} />
                  </button>
                </div>
                <div className="text-center">
                  <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-2 text-gray-900">
                    Womens Elbow Sleeve V-Neck
                  </h3>
                  <div className="text-gray-500 text-xs mb-4 font-medium tracking-wider">
                    RS 25,400
                  </div>
                  <div className="flex justify-center gap-1.5 mb-4">
                    <span className="w-3.5 h-3.5 rounded-full border border-gray-200 bg-white"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-gray-900"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-800"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-gray-700"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-purple-700"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-blue-100"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-teal-600"></span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-gray-900">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} className="fill-current" />
                    ))}
                    <span className="text-[10px] font-medium text-gray-400 ml-1">(4.8)</span>
                  </div>
                </div>
              </div>

              {/* Product 3 */}
              <div className="flex flex-col">
                <div className="relative aspect-4/5 overflow-hidden mb-6 group/item">
                  <Image
                    src="https://res.cloudinary.com/dnfbik3if/image/upload/v1770443930/Beige_White_and_Brown_Modern_Fashion_Facebook_Cover_on5b6y.jpg"
                    alt="Product 3"
                    fill
                    className="object-cover transition-transform duration-500 group-hover/item:scale-105"
                  />
                  <span className="absolute top-2 left-2 bg-gray-900 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1">
                    Best Seller
                  </span>
                  <button className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-sm shadow-sm opacity-0 translate-y-2 group-hover/item:opacity-100 group-hover/item:translate-y-0 transition-all hover:bg-gold-500 hover:text-white">
                    <Plus size={18} />
                  </button>
                </div>
                <div className="text-center">
                  <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-2 text-gray-900">
                    Womens Elbow Sleeve Crew Neck
                  </h3>
                  <div className="text-gray-500 text-xs mb-4 font-medium tracking-wider">
                    RS 25,400
                  </div>
                  <div className="flex justify-center gap-1.5 mb-4">
                    <span className="w-3.5 h-3.5 rounded-full border border-gray-200 bg-white shadow-inner"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-gray-900"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-800"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-gray-700"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-purple-700"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-blue-100"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-teal-600"></span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-gray-900">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} className="fill-current" />
                    ))}
                    <span className="text-[10px] font-medium text-gray-400 ml-1">(4.8)</span>
                  </div>
                </div>
              </div>

              {/* Product 4 */}
              <div className="flex flex-col">
                <div className="relative aspect-4/5 overflow-hidden mb-6 group/item">
                  <Image
                    src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1000"
                    alt="Product 4"
                    fill
                    className="object-cover transition-transform duration-500 group-hover/item:scale-105"
                  />
                  <span className="absolute top-2 left-2 bg-gray-900 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1">
                    Best Seller
                  </span>
                  <button className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-sm shadow-sm opacity-0 translate-y-2 group-hover/item:opacity-100 group-hover/item:translate-y-0 transition-all hover:bg-gold-500 hover:text-white">
                    <Plus size={18} />
                  </button>
                </div>
                <div className="text-center">
                  <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-2 text-gray-900">
                    Womens Long Sleeve Crew Neck
                  </h3>
                  <div className="text-gray-500 text-xs mb-4 font-medium tracking-wider">
                    RS 28,600
                  </div>
                  <div className="flex justify-center gap-1.5 mb-4 flex-wrap max-w-[160px] mx-auto">
                    <span className="w-3.5 h-3.5 rounded-full border border-gray-200 bg-white"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-gray-900"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-800"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-gray-700"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-gray-600"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-teal-600"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-blue-100"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-800"></span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-gray-900">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} className="fill-current" />
                    ))}
                    <span className="text-[10px] font-medium text-gray-400 ml-1">(4.7)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Slider Arrow */}
            <button className="absolute right-0 top-[40%] translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center z-10 hover:bg-gold-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-gold-100/30 border-t border-gold-200/40 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gold-500 rounded-full blur-sm opacity-20"></div>
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div>
              <h2 className="text-2xl font-serif text-gray-900 inline-block mr-4">
                Real Reviews From Real Customers
              </h2>
              <Link href="/reviews" className="text-sm text-gray-500 underline hover:text-gold-500 transition-colors">
                See all reviews
              </Link>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-gray-900 text-gray-900" />
                ))}
                <span className="ml-2 text-sm text-gray-500">4012 Reviews</span>
              </div>
              <div className="flex gap-2">
                <button className="p-2 border border-gray-200 rounded-full hover:border-gold-500 hover:text-gold-500 transition-colors">
                  <ChevronLeft size={20} />
                </button>
                <button className="p-2 border border-gray-200 rounded-full hover:border-gold-500 hover:text-gold-500 transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Reviews Grid/Scroll */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Review 1 */}
            <div className="flex gap-6">
              <div className="shrink-0 w-16 h-16 rounded-full border border-gray-100 flex items-center justify-center bg-gray-50">
                <Quote size={24} className="text-gold-500" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-gray-900 text-gray-900" />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">03/14/25</span>
                </div>
                <h3 className="font-serif text-lg mb-2 text-gray-900">The way it feels when wearing</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4 italic">
                  "I know they are made of cotton but they feel like cashmere. I love mine and have already ordered again."
                </p>
                <span className="text-sm font-bold tracking-wider text-gray-900">LeighAnn C.</span>
              </div>
            </div>

            {/* Review 2 */}
            <div className="flex gap-6">
              <div className="shrink-0 w-16 h-16 rounded-full border border-gray-100 flex items-center justify-center bg-gray-50">
                <Quote size={24} className="text-gold-500" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-gray-900 text-gray-900" />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">05/21/25</span>
                </div>
                <h3 className="font-serif text-lg mb-2 text-gray-900">Best tees I've ever owned!</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4 italic">
                  "I own 13 items from the classic cloth company and they are by far the best Cloths I've ever owned! They are so soft and hold th..."
                </p>
                <button className="text-xs font-bold underline mb-4 block hover:text-gold-500">Read More</button>
                <span className="text-sm font-bold tracking-wider text-gray-900">Maria P.</span>
              </div>
            </div>

            {/* Review 3 */}
            <div className="flex gap-6">
              <div className="relative shrink-0 w-16 h-20 overflow-hidden rounded-sm">
                <Image
                  src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=200"
                  alt="Product"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-gray-900 text-gray-900" />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">06/14/25</span>
                </div>
                <h3 className="font-serif text-lg mb-2 text-gray-900">I love the Cloths, runs</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4 italic">
                  "I love the Cloths, runs a little small and I had to exchange it for a larger size. No problem exchanging it, prompt and efficient cu..."
                </p>
                <button className="text-xs font-bold underline mb-4 block hover:text-gold-500">Read More</button>
                <span className="text-sm font-bold tracking-wider text-gray-900">Carmen K.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* French Terry Section */}
      <section className="py-20 bg-gold-50/30 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-gold-300 to-transparent"></div>
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 leading-none">
          {/* Women's Card */}
          <div className="relative aspect-4/5 md:aspect-auto md:h-[80vh] overflow-hidden group">
            <div className="flex w-full h-full">
              <div className="relative w-1/2 h-full overflow-hidden border-r border-white/10">
                <Image
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000"
                  alt="French Terry Women 1"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="relative w-1/2 h-full overflow-hidden">
                <Image
                  src="https://res.cloudinary.com/dnfbik3if/image/upload/v1770443930/Beige_White_and_Brown_Modern_Fashion_Facebook_Cover_on5b6y.jpg"
                  alt="French Terry Women 2"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </div>
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-500" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 text-white">
              <span className="text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase mb-4 text-gold-300">
                Ethically Crafted In Sri Lanka
              </span>
              <h2 className="text-3xl md:text-4xl font-serif mb-8 leading-tight uppercase font-bold tracking-wider max-w-sm">
                Women's Inspired Sweatshirts & Joggers
              </h2>
              <Link
                href="/women/french-terry"
                className="inline-block bg-white text-gray-900 border border-transparent px-8 md:px-12 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-gold-500 hover:text-white transition-all w-fit"
              >
                Shop Quality
              </Link>
            </div>
          </div>

          {/* Men's Card */}
          <div className="relative aspect-4/5 md:aspect-auto md:h-[80vh] overflow-hidden group">
            <div className="flex w-full h-full">
              <div className="relative w-1/2 h-full overflow-hidden border-r border-white/10">
                <Image
                  src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=1000"
                  alt="French Terry Men 1"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="relative w-1/2 h-full overflow-hidden">
                <Image
                  src="https://res.cloudinary.com/dnfbik3if/image/upload/v1770443139/Black_Modern_Fashion_Magazine_Cover_dowh0p.jpg"
                  alt="French Terry Men 2"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </div>
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-500" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 text-white">
              <span className="text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase mb-4 text-gold-300">
                100% Organic Sri Lankan Cotton
              </span>
              <h2 className="text-3xl md:text-4xl font-serif mb-8 leading-tight uppercase font-bold tracking-wider max-w-sm">
                Mens Inspired Sweatshirts & Shorts
              </h2>
              <Link
                href="/men/french-terry"
                className="inline-block bg-white text-gray-900 border border-transparent px-8 md:px-12 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-gold-500 hover:text-white transition-all w-fit"
              >
                Shop Durability
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories / Stats (Trust Bar) */}
      <section className="py-24 bg-gold-50/80 relative overflow-hidden">
        {/* Decorative Gold Leaf in background */}
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.05] pointer-events-none">

        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 text-center relative z-10">
          <div className="flex flex-col items-center group">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-6 shadow-lg border border-gold-100 group-hover:bg-gold-500 transition-all duration-500">
              <Feather className="text-gold-600 group-hover:text-white transition-colors" size={36} strokeWidth={1} />
            </div>
            <h3 className="text-3xl font-serif mb-3 text-gray-900 group-hover:text-gold-700 transition-colors">100% Cotton</h3>
            <p className="text-gold-600 uppercase tracking-[0.2em] text-[10px] font-bold">Premium Fabric</p>
          </div>
          <div className="flex flex-col items-center group">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-6 shadow-lg border border-gold-100 group-hover:bg-gold-500 transition-all duration-500">
              <Scissors className="text-gold-600 group-hover:text-white transition-colors" size={36} strokeWidth={1} />
            </div>
            <h3 className="text-3xl font-serif mb-3 text-gray-900 group-hover:text-gold-700 transition-colors">Artisan Made</h3>
            <p className="text-gold-600 uppercase tracking-[0.2em] text-[10px] font-bold">Meticulous Craftsmanship</p>
          </div>
          <div className="flex flex-col items-center group">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-6 shadow-lg border border-gold-100 group-hover:bg-gold-500 transition-all duration-500">
              <Leaf className="text-gold-600 group-hover:text-white transition-colors" size={36} strokeWidth={1} />
            </div>
            <h3 className="text-3xl font-serif mb-3 text-gray-900 group-hover:text-gold-700 transition-colors">Sustainable</h3>
            <p className="text-gold-600 uppercase tracking-[0.2em] text-[10px] font-bold">Eco-Conscious Fashion</p>
          </div>
        </div>
      </section>

      {/* Why Sri Lankan Cotton Section */}
      <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
        <Image
          src="https://res.cloudinary.com/dnfbik3if/image/upload/v1770443694/Brown_Minimalist_Fashion_Facebook_Cover_edhreh.jpg"
          alt="Organic Cotton Background"
          fill
          className="object-cover opacity-90 brightness-50"
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-xs md:text-sm font-bold tracking-[0.4em] uppercase mb-8">
            Why Sri Lankan Cotton?
          </h2>
          <p className="text-lg md:text-2xl font-light leading-relaxed mb-12 opacity-90">
            DressCo was founded to redefine the fashion industry in Sri Lanka by creating ethically
            made luxury essentials. We are proud to present our range of 100% GOTS Certified
            Organic Cotton Cloths, meticulously crafted for the conscious individual who
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


