'use client';

import {
  ArrowRight,
  Bell,
  Check,
  ChevronDown,
  ChevronUp,
  Heart,
  Package,
  RotateCcw,
  Ruler,
  Share2,
  Shield,
  ShoppingBag,
  Star,
  StarHalf,
  Truck,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

const PRODUCT = {
  name: 'Howie the Hippo',
  tagline: 'Ultra-soft plush toy for ages 0+',
  price: 28,
  originalPrice: 35,
  rating: 4.7,
  reviewCount: 860,
  description:
    'A squishy, huggable hippo plush made from ultra-soft velvet-touch polyester with a cloud-like polyester fill. Designed with baby-safe embroidered features, rounded proportions, and a weighted bottom so he always sits upright. The perfect companion from nursery to naptime.',
  specs: [
    ['Size', '8" seated / 10" head to toe'],
    ['Weight', '180 g (6.3 oz)'],
    ['Material', '100% Polyester Plush'],
    ['Fill', 'Recycled Polyester Fiber'],
    ['Age Range', '0+ months'],
    ['Safety', 'ASTM F963 · EN71 · CPSIA'],
    ['Care', 'Machine washable, tumble dry low'],
  ],
  inBox: ['Howie the Hippo Plush (×1)', 'Satin Ribbon Gift Tag', 'Care & Safety Card'],
  colors: [
    { name: 'Cocoa Brown', hex: '#a07858', available: true },
    { name: 'Lavender Mist', hex: '#b8a9c9', available: false },
    { name: 'Cloud Grey', hex: '#b0b0b0', available: true },
    { name: 'Blush Pink', hex: '#d4a0a0', available: true },
  ],
  // Labels for each image in the horizontal gallery
  productImages: [
    { label: 'Front view', src: '/product/hippo-front.jpg' },
    { label: 'Left view', src: '/product/hippo-left.jpg' },
    { label: 'Right view', src: '/product/hippo-right.jpg' },
    { label: 'Top view', src: '/product/hippo-top.jpg' },
  ],
};

const REVIEWS = [
  {
    name: 'Sarah M.',
    initials: 'SM',
    rating: 5,
    date: '1 week ago',
    text: "Bought this for my 6-month-old and she immediately latched onto it. The softness is unreal — way better than the other plush toys we've tried. It's survived three washes and still looks brand new.",
  },
  {
    name: 'David K.',
    initials: 'DK',
    rating: 5,
    date: '3 weeks ago',
    text: 'Got this as a baby shower gift and the mom-to-be teared up. The quality is obvious the moment you pick it up. The weighted bottom is a genius touch — it sits perfectly on a shelf or nightstand.',
  },
  {
    name: 'Priya R.',
    initials: 'PR',
    rating: 4,
    date: '2 weeks ago',
    text: "Adorable and incredibly well-made. My toddler carries it everywhere. Only reason for 4 stars is I wish there were more animals in this collection — we'd buy them all!",
  },
];

const CROSS_SELLS = [
  {
    name: 'Ellie the Elephant',
    price: 28,
    rating: 4.8,
    image: '/product/elephant-sm.jpg',
  },
  {
    name: 'Benny the Bunny',
    price: 24,
    rating: 4.6,
    image: '/product/bunny-sm.jpg',
  },
  {
    name: 'Gigi the Giraffe',
    price: 30,
    rating: 4.7,
    image: '/product/giraffe-sm.jpg',
  },
  {
    name: 'Teddy the Bear',
    price: 26,
    rating: 4.5,
    image: '/product/bear-sm.jpg',
  },
];

/* ─────────────────────────────────────────────
   STARS COMPONENT
───────────────────────────────────────────── */

function Stars({ rating, size = 14 }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.3;
  return (
    <span className='inline-flex items-center gap-0.5'>
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full) return <Star key={i} size={size} className='fill-amber-400 text-amber-400' />;
        if (i === full && half) return <StarHalf key={i} size={size} className='fill-amber-400 text-amber-400' />;
        return <Star key={i} size={size} className='text-gray-200' />;
      })}
    </span>
  );
}

/* ─────────────────────────────────────────────
   ACCORDION COMPONENT
───────────────────────────────────────────── */

function Accordion({ title, icon: Icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className='border-b border-gray-100'>
      <button
        onClick={() => setOpen(!open)}
        className='flex w-full items-center justify-between py-4 text-left'
        aria-expanded={open}>
        <span className='flex items-center gap-2.5 text-sm font-medium text-gray-900'>
          {Icon && <Icon size={16} className='text-gray-400' />}
          {title}
        </span>
        {open ? <ChevronUp size={16} className='text-gray-400' /> : <ChevronDown size={16} className='text-gray-400' />}
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          open ? 'max-h-[500px] pb-5 opacity-100' : 'max-h-0 opacity-0'
        }`}>
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */

export default function ProductPage() {
  const [selectedColor, setSelectedColor] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [showStickyCart, setShowStickyCart] = useState(false);
  const [addedToWishlist, setAddedToWishlist] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const galleryRef = useRef(null);

  const currentColor = PRODUCT.colors[selectedColor];
  const isAvailable = currentColor.available;
  const discount = Math.round(((PRODUCT.originalPrice - PRODUCT.price) / PRODUCT.originalPrice) * 100);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setShowStickyCart(!entry.isIntersecting), { threshold: 0 });
    if (galleryRef.current) observer.observe(galleryRef.current);
    return () => observer.disconnect();
  }, []);

  function handleAddToCart() {
    if (!isAvailable) return;
    setCartCount((c) => c + 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  }

  const colorFilter =
    selectedColor === 0
      ? 'none'
      : `hue-rotate(${
          selectedColor === 1 ? '220deg' : selectedColor === 2 ? '180deg' : '330deg'
        }) saturate(${selectedColor === 2 ? '0.3' : '0.7'})`;

  return (
    <div className='min-h-screen bg-white text-gray-900 antialiased'>
      {/* ═══ NAV ═══ */}
      <nav className='sticky top-0 z-50 flex items-center justify-between border-b border-gray-100 bg-white/95 px-5 py-3.5 backdrop-blur-sm sm:px-8 lg:px-12'>
        <a href='#' className='text-sm font-semibold tracking-tight text-gray-900'>
          Tumble & Snug
        </a>
        <button className='relative p-1.5 text-gray-500 transition-colors hover:text-gray-900'>
          <ShoppingBag size={20} />
          {cartCount > 0 && (
            <span className='absolute -right-1 -top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gray-900 text-[10px] font-medium text-white'>
              {cartCount}
            </span>
          )}
        </button>
      </nav>

      {/* ═══ MAIN ═══ */}
      <main className='mx-auto max-w-6xl lg:grid lg:grid-cols-2 lg:gap-16 lg:px-12 lg:pt-10'>
        {/* ─── LEFT: HORIZONTAL IMAGE GALLERY ─── */}
        <section className='lg:sticky lg:top-20 lg:self-start'>
          <div
            ref={galleryRef}
            className='flex gap-2 overflow-x-auto px-4 py-3 lg:flex-col lg:gap-3 lg:overflow-x-visible lg:px-0 lg:py-0'
            style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {PRODUCT.productImages.map((image, i) => (
              <div key={i} className='w-80 relative flex-shrink-0 overflow-hidden rounded-lg bg-gray-50'>
                <div>
                  <img
                    src={image.src}
                    alt={`${PRODUCT.name} — ${image.label}`}
                    className='h-full w-full object-contain'
                    style={{ filter: colorFilter }}
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                </div>
                <span className='absolute bottom-2.5 left-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-medium text-gray-500 backdrop-blur-sm'>
                  {image.label}
                </span>
              </div>
            ))}
          </div>

          {/* Hide scrollbar via inline style for Webkit */}
          <style>{`
            [style*="scrollbarWidth"] ::-webkit-scrollbar { display: none; }
            section:first-of-type > div::-webkit-scrollbar { display: none; }
          `}</style>
        </section>

        {/* ─── RIGHT: DETAILS ─── */}
        <section className='px-5 pb-32 pt-6 sm:px-8 lg:px-0 lg:pb-20 lg:pt-0'>
          {/* Breadcrumb-style category label */}
          <p className='mb-3 text-xs font-medium text-gray-400'>Little Friends Collection</p>

          <h1 className='text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl'>{PRODUCT.name}</h1>
          <p className='mt-1 text-sm text-gray-500'>{PRODUCT.tagline}</p>

          {/* Rating */}
          <div className='mt-3 flex items-center gap-2'>
            <Stars rating={PRODUCT.rating} />
            <span className='text-sm font-medium text-gray-700'>{PRODUCT.rating}</span>
            <span className='text-sm text-gray-300'>·</span>
            <a href='#reviews' className='text-sm text-gray-500 hover:text-gray-700'>
              {PRODUCT.reviewCount.toLocaleString()} reviews
            </a>
          </div>

          {/* Price */}
          <div className='mt-6 flex items-baseline gap-2.5'>
            <span className='text-2xl font-semibold text-gray-900'>${PRODUCT.price}</span>
            <span className='text-sm text-gray-400 line-through'>${PRODUCT.originalPrice}</span>
            <span className='rounded bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700'>
              {discount}% off
            </span>
          </div>

          {/* Color selector */}
          <div className='mt-8'>
            <p className='text-sm text-gray-600'>
              Color — <span className='font-medium text-gray-900'>{currentColor.name}</span>
            </p>
            <div className='mt-3 flex gap-2.5'>
              {PRODUCT.colors.map((color, i) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(i)}
                  title={color.name}
                  className={`relative h-9 w-9 rounded-full transition-all ${
                    selectedColor === i
                      ? 'ring-2 ring-gray-900 ring-offset-2'
                      : 'ring-1 ring-gray-200 hover:ring-gray-400'
                  }`}
                  style={{ backgroundColor: color.hex }}>
                  {selectedColor === i && (
                    <Check size={14} className='absolute inset-0 m-auto text-white drop-shadow' />
                  )}
                  {!color.available && (
                    <span className='absolute inset-0 flex items-center justify-center'>
                      <span className='block h-full w-px rotate-45 bg-white/80' />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* CTA buttons */}
          <div className='mt-8 flex gap-2.5'>
            {isAvailable ? (
              <button
                onClick={handleAddToCart}
                className='flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 active:bg-gray-950'>
                {justAdded ? (
                  <>
                    <Check size={16} /> Added to cart
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} /> Add to cart
                  </>
                )}
              </button>
            ) : (
              <button className='flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-100 px-6 py-3 text-sm font-medium text-gray-400'>
                <Bell size={16} /> Notify when available
              </button>
            )}
            <button
              onClick={() => setAddedToWishlist(!addedToWishlist)}
              className={`flex items-center justify-center rounded-lg border px-3 transition-colors ${
                addedToWishlist
                  ? 'border-gray-200 bg-gray-50 text-red-500'
                  : 'border-gray-200 text-gray-400 hover:text-gray-600'
              }`}
              aria-label='Add to wishlist'>
              <Heart size={18} className={addedToWishlist ? 'fill-red-500' : ''} />
            </button>
            <button
              className='flex items-center justify-center rounded-lg border border-gray-200 px-3 text-gray-400 transition-colors hover:text-gray-600'
              aria-label='Share'>
              <Share2 size={18} />
            </button>
          </div>

          {/* Shipping highlights */}
          <div className='mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500'>
            <span className='flex items-center gap-1.5'>
              <Truck size={14} className='text-gray-400' /> Free shipping over $40
            </span>
            <span className='flex items-center gap-1.5'>
              <RotateCcw size={14} className='text-gray-400' /> 30-day returns
            </span>
            <span className='flex items-center gap-1.5'>
              <Shield size={14} className='text-gray-400' /> Baby-safe certified
            </span>
          </div>

          {/* Description */}
          <div className='mt-10'>
            <p className='text-sm leading-relaxed text-gray-600'>{PRODUCT.description}</p>
          </div>

          {/* Accordions */}
          <div className='mt-8'>
            <Accordion title='Specifications' icon={Ruler} defaultOpen>
              <table className='w-full text-sm'>
                <tbody>
                  {PRODUCT.specs.map(([key, val]) => (
                    <tr key={key} className='border-t border-gray-50'>
                      <td className='py-2 pr-4 text-gray-400'>{key}</td>
                      <td className='py-2 text-gray-700'>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Accordion>

            <Accordion title="What's in the box" icon={Package}>
              <ul className='space-y-1.5 text-sm text-gray-600'>
                {PRODUCT.inBox.map((item) => (
                  <li key={item} className='flex items-center gap-2'>
                    <Check size={14} className='text-green-500' />
                    {item}
                  </li>
                ))}
              </ul>
            </Accordion>

            <Accordion title='Shipping & delivery' icon={Truck}>
              <div className='space-y-2 text-sm text-gray-600'>
                <p>Free standard shipping on all orders over $40. Estimated delivery in 3–5 business days.</p>
                <p>Express shipping available at checkout for $6 — delivers within 1–2 business days.</p>
              </div>
            </Accordion>

            <Accordion title='Returns policy' icon={RotateCcw}>
              <div className='space-y-2 text-sm text-gray-600'>
                <p>30-day hassle-free returns. Products must be in original condition with tags attached.</p>
                <p>Refunds are processed within 5 business days of receiving the returned item.</p>
              </div>
            </Accordion>
          </div>

          {/* Reviews */}
          <section id='reviews' className='mt-12 scroll-mt-20'>
            <h2 className='text-lg font-semibold text-gray-900'>Customer Reviews</h2>

            <div className='mt-4 flex items-start gap-6'>
              <div className='text-center'>
                <span className='block text-3xl font-semibold text-gray-900'>{PRODUCT.rating}</span>
                <Stars rating={PRODUCT.rating} size={12} />
                <span className='mt-1 block text-xs text-gray-400'>{PRODUCT.reviewCount.toLocaleString()} reviews</span>
              </div>
              <div className='flex-1 space-y-1'>
                {[
                  { stars: 5, pct: 72 },
                  { stars: 4, pct: 18 },
                  { stars: 3, pct: 6 },
                  { stars: 2, pct: 3 },
                  { stars: 1, pct: 1 },
                ].map(({ stars, pct }) => (
                  <div key={stars} className='flex items-center gap-2 text-xs'>
                    <span className='w-3 text-right text-gray-500'>{stars}</span>
                    <Star size={10} className='fill-amber-400 text-amber-400' />
                    <div className='h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100'>
                      <div className='h-full rounded-full bg-amber-400' style={{ width: `${pct}%` }} />
                    </div>
                    <span className='w-7 text-right text-gray-400'>{pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className='mt-8 space-y-4'>
              {REVIEWS.map((review, i) => (
                <div key={i} className='border-t border-gray-100 pt-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600'>
                      {review.initials}
                    </div>
                    <div>
                      <p className='text-sm font-medium text-gray-900'>{review.name}</p>
                      <div className='flex items-center gap-2'>
                        <Stars rating={review.rating} size={11} />
                        <span className='text-xs text-gray-400'>{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className='mt-2.5 text-sm leading-relaxed text-gray-600'>{review.text}</p>
                </div>
              ))}
            </div>

            <button className='mt-6 flex items-center gap-1 text-sm font-medium text-gray-900 hover:underline'>
              See all {PRODUCT.reviewCount.toLocaleString()} reviews
              <ArrowRight size={14} />
            </button>
          </section>

          {/* Cross-sells */}
          <section className='mt-14'>
            <h2 className='text-lg font-semibold text-gray-900'>You may also like</h2>
            <div className='mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4'>
              {CROSS_SELLS.map((item, i) => (
                <div
                  key={i}
                  className='group cursor-pointer rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100'>
                  <div className='flex h-36 items-center justify-center rounded-md text-4xl overflow-hidden'>
                    <img src={item.image} alt={item.name} className='w-full h-full object-cover object-top' />
                  </div>
                  <p className='mt-2.5 text-sm font-medium text-gray-900'>{item.name}</p>
                  <div className='mt-0.5 flex items-center gap-1'>
                    <Stars rating={item.rating} size={10} />
                    <span className='text-xs text-gray-400'>{item.rating}</span>
                  </div>
                  <p className='mt-1 text-sm font-semibold text-gray-900'>${item.price}</p>
                </div>
              ))}
            </div>
          </section>
        </section>
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className='mt-16 border-t border-gray-100 px-5 py-8 sm:px-8'>
        <div className='mx-auto max-w-6xl'>
          <div className='flex flex-wrap justify-center gap-6 text-xs text-gray-400'>
            {['FAQ', 'Contact', 'Warranty', 'Privacy'].map((link) => (
              <a key={link} href='#' className='transition-colors hover:text-gray-600'>
                {link}
              </a>
            ))}
          </div>
          <p className='mt-4 text-center text-xs text-gray-300'>© {new Date().getFullYear()} Tumble & Snug</p>
        </div>
      </footer>

      {/* ═══ STICKY MOBILE CTA ═══ */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 border-t border-gray-100 bg-white/95 px-5 py-3 backdrop-blur-sm transition-transform duration-200 lg:hidden ${
          showStickyCart ? 'translate-y-0' : 'translate-y-full'
        }`}>
        <div className='flex items-center gap-4'>
          <div>
            <span className='text-base font-semibold text-gray-900'>${PRODUCT.price}</span>
            <span className='ml-1.5 text-sm text-gray-400 line-through'>${PRODUCT.originalPrice}</span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!isAvailable}
            className='flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:bg-gray-100 disabled:text-gray-400'>
            {justAdded ? (
              <>
                <Check size={16} /> Added
              </>
            ) : isAvailable ? (
              <>
                <ShoppingBag size={16} /> Add to cart
              </>
            ) : (
              <>
                <Bell size={16} /> Notify me
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}