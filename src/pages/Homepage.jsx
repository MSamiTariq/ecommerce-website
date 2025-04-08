"use client";

import { useState, useEffect, useRef } from "react";
import { ShoppingCartIcon, UserIcon } from "@heroicons/react/24/outline";
import ItemModal from "../components/ItemModal";
import CartModal from "../components/CartModal";
import { useCart } from "../contexts/CartContext";
import SheetDB from "sheetdb-js";

const offers = [
  {
    name: "Order Fresh Flour Online",
    description: "Get free delivery on orders above Rs. 2,000!",
    href: "#",
  },
  {
    name: "Satisfaction Guaranteed",
    description:
      "Return your order within 7 days if you're not happy, no questions asked.",
    href: "#",
  },
  {
    name: "Sign Up for Updates",
    description:
      "Subscribe to our newsletter and get Rs. 500 off your first order.",
    href: "#",
  },
];

const testimonials = [
  {
    id: 1,
    quote:
      "The flour quality is exceptional, and it has made a noticeable difference in my baking. Highly recommend!",
    attribution: "Ayesha Khan, Karachi",
  },
  {
    id: 2,
    quote:
      "I love the variety of grains available. The freshness and taste are unmatched. Will definitely order again!",
    attribution: "Ahmed Ali, Lahore",
  },
  {
    id: 3,
    quote:
      "The customer service is fantastic, and the delivery was prompt. The flour is fresh and perfect for my needs.",
    attribution: "Fatima Malik, Islamabad",
  },
];
const footerNavigation = {
  products: [
    { name: "Bags", href: "#" },
    { name: "Tees", href: "#" },
    { name: "Objects", href: "#" },
    { name: "Home Goods", href: "#" },
    { name: "Accessories", href: "#" },
  ],
  customerService: [
    { name: "Contact", href: "#" },
    { name: "Shipping", href: "#" },
    { name: "Returns", href: "#" },
    { name: "Warranty", href: "#" },
    { name: "Secure Payments", href: "#" },
    { name: "FAQ", href: "#" },
    { name: "Find a store", href: "#" },
  ],
  company: [
    { name: "Who we are", href: "#" },
    { name: "Sustainability", href: "#" },
    { name: "Press", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Terms & Conditions", href: "#" },
    { name: "Privacy", href: "#" },
  ],
  legal: [
    { name: "Terms of Service", href: "#" },
    { name: "Return Policy", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Shipping Policy", href: "#" },
  ],
  bottomLinks: [
    { name: "Accessibility", href: "#" },
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
  ],
};

export default function Homepage() {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [youtubeUrl, setYoutubeUrl] = useState();
  const [videoVisible, setVideoVisible] = useState(false);
  const videoSectionRef = useRef(null);
  const { getCartCount } = useCart();

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  useEffect(() => {
    SheetDB.read("https://sheetdb.io/api/v1/bri2jnuyh42f9", {}).then(
      function (result) {
        const processedProducts = result.map((product) => {
          return {
            ...product,
            sizes: JSON.parse(product.sizes),
          };
        });
        setProducts(processedProducts);
      },
      function (error) {
        console.log(error);
      }
    );
  }, []);

  useEffect(() => {
    SheetDB.read(
      "https://sheetdb.io/api/v1/bri2jnuyh42f9?sheet=sheet2",
      {}
    ).then(function (result) {
      setYoutubeUrl(result[0].youtubeUrl);
    });
  });

  // Set up intersection observer for video section
  useEffect(() => {
    if (!videoSectionRef.current) return;

    // Store the ref value in a variable inside the effect
    const currentRef = videoSectionRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setVideoVisible(entry.isIntersecting);
      },
      {
        root: null, // Use viewport as root
        rootMargin: "0px",
        threshold: 0.3, // Trigger when 30% of the element is visible
      }
    );

    observer.observe(currentRef);

    // Clean up - use the stored ref value
    return () => {
      observer.unobserve(currentRef);
    };
  }, []);

  // Construct video URL with autoplay parameter based on visibility
  const videoUrl = videoVisible
    ? `${youtubeUrl}&autoplay=1&mute=1&loop=1&playlist=bVfyZ5Ew0QQ`
    : `${youtubeUrl}loop=1&playlist=bVfyZ5Ew0QQ`;

  return (
    <div className="bg-white">
      <header className="relative z-10">
        <nav aria-label="Top">
          {/* Top navigation */}
          <div className="bg-gray-900">
            <div className="mx-auto flex h-10 max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
              <p className="flex-1 text-center text-sm font-medium text-white lg:flex-none">
                Get free delivery on orders over Rs. 2,000
              </p>
            </div>
          </div>

          {/* Secondary navigation */}
          <div className="bg-white">
            <div className="border-b border-gray-200">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  {/* Logo (lg+) */}
                  <div className="hidden lg:flex lg:items-center">
                    <span>
                      <span className="sr-only">Your Company</span>
                      <img
                        alt=""
                        src="/assets/images/khalislogo.jpg"
                        className="h-16 w-auto"
                      />
                    </span>
                  </div>

                  {/* Logo (lg-) */}
                  <span className="lg:hidden">
                    <span className="sr-only">Your Company</span>
                    <img
                      alt=""
                      src="/assets/images/khalislogo.jpg"
                      className="h-12 w-auto"
                    />
                  </span>

                  <div className="flex flex-1 items-center justify-end">
                    <div className="flex items-center lg:ml-8">
                      <div className="flex space-x-8">
                        <div className="flex">
                          <span className="-m-2 p-2 text-gray-400 hover:text-gray-500">
                            <span className="sr-only">Account</span>
                            <UserIcon aria-hidden="true" className="size-6" />
                          </span>
                        </div>
                      </div>

                      <span
                        aria-hidden="true"
                        className="mx-4 h-6 w-px bg-gray-200 lg:mx-6"
                      />

                      <div className="flow-root">
                        <button
                          className="group -m-2 flex items-center p-2"
                          onClick={() => setCartOpen(true)}
                        >
                          <ShoppingCartIcon
                            aria-hidden="true"
                            className="size-6 shrink-0 text-gray-400 group-hover:text-gray-500"
                          />
                          <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                            {getCartCount()}
                          </span>
                          <span className="sr-only">
                            items in cart, view bag
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <div className="flex flex-col border-b border-gray-200 lg:border-0">
          <nav aria-label="Offers" className="order-last lg:order-first">
            <div className="mx-auto max-w-7xl lg:px-8">
              <ul className="grid grid-cols-1 divide-y divide-gray-200 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
                {offers.map((offer) => (
                  <li key={offer.name} className="flex flex-col">
                    <a
                      href={offer.href}
                      className="relative flex flex-1 flex-col justify-center bg-white px-4 py-6 text-center focus:z-10"
                    >
                      <p className="text-sm text-gray-500">{offer.name}</p>
                      <p className="font-semibold text-gray-900">
                        {offer.description}
                      </p>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Video Section */}
          <section
            ref={videoSectionRef}
            className="bg-gray-50 py-12 sm:py-16 lg:py-20"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Experience Our Quality Products
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
                  Discover how our premium products can enhance your everyday
                  life with natural goodness and exceptional quality.
                </p>
              </div>

              <div className="mt-10 flex justify-center">
                <div className="relative overflow-hidden rounded-xl shadow-2xl max-w-4xl w-full aspect-video">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={videoUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>

              <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6 sm:gap-12">
                <div className="flex items-center justify-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c68b2f] bg-opacity-10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 text-[#c68b2f]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                      />
                    </svg>
                  </span>
                  <p className="ml-4 text-lg font-medium text-gray-900">
                    Premium Quality
                  </p>
                </div>

                <div className="flex items-center justify-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c68b2f] bg-opacity-10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 text-[#c68b2f]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                      />
                    </svg>
                  </span>
                  <p className="ml-4 text-lg font-medium text-gray-900">
                    Natural Products
                  </p>
                </div>

                <div className="flex items-center justify-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c68b2f] bg-opacity-10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 text-[#c68b2f]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                      />
                    </svg>
                  </span>
                  <p className="ml-4 text-lg font-medium text-gray-900">
                    Made with Love
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute hidden h-full w-1/2 bg-gray-100 lg:block"
            />
            <div className="relative bg-gray-100 lg:bg-transparent">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:grid lg:grid-cols-2 lg:px-8">
                <div className="mx-auto max-w-2xl py-24 lg:max-w-none lg:py-64">
                  <div className="lg:pr-16">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl xl:text-6xl">
                      Fueling Happiness, Naturally — Choose Freshness, Choose
                      Health
                    </h1>
                    <p className="mt-4 text-xl text-gray-600">
                      Experience the richness of freshly milled grains tailored
                      to your taste and needs. From top-quality wheat to your
                      favorite blends, we grind it fresh for you!
                    </p>
                    <div className="mt-6">
                      <span
                        className="inline-block rounded-md border border-transparent bg-[#c68b2f] px-8 py-3 font-medium text-white hover:bg-[#a67524] cursor-pointer"
                        onClick={() => {
                          document
                            .getElementById("trending-heading")
                            .scrollIntoView({
                              behavior: "smooth",
                            });
                        }}
                      >
                        Order Now
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-48 w-full sm:h-64 lg:absolute lg:right-0 lg:top-0 lg:h-full lg:w-1/2">
              <img
                alt=""
                src="/assets/images/khalisLandingMobile.jpg"
                className="size-full object-fill block lg:hidden"
              />
              <img
                src="/assets/images/largeLandingPage.jpg"
                alt="Large Landing Page"
                className="hidden lg:block size-full"
              />
            </div>
          </div>
        </div>

        {/* Trending products */}
        <section aria-labelledby="trending-heading" className="bg-white">
          <div className="py-16 sm:py-24 lg:mx-auto lg:max-w-7xl lg:px-8 lg:py-32">
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-0">
              <h2
                id="trending-heading"
                className="text-2xl font-bold tracking-tight text-gray-900"
              >
                Explore Our Product Range
              </h2>
            </div>

            <div className="relative mt-8">
              <div className="relative w-full overflow-x-auto">
                <ul className="mx-4 inline-flex space-x-8 sm:mx-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-x-8 lg:space-x-0">
                  {products.map((product) => (
                    <li
                      key={product.id}
                      className="inline-flex w-64 flex-col text-center mb-6 lg:w-auto cursor-pointer"
                      onClick={() => handleProductClick(product)}
                    >
                      <div className="group relative">
                        <img
                          alt={product.imageAlt}
                          src={product.imageSrc}
                          className="aspect-square w-full rounded-md bg-gray-200 object-contain group-hover:opacity-75"
                        />
                        <div className="mt-6">
                          <p className="text-sm text-gray-500">
                            {product.weight}
                          </p>
                          <h3 className="mt-1 font-semibold text-gray-900">
                            <a href={product.href}>
                              <span className="absolute inset-0" />
                              {product.name}
                            </a>
                          </h3>
                          <p className="mt-1 text-gray-900">
                            Rs. {product.price}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Sale and testimonials */}
        <div className="relative overflow-hidden">
          {/* Decorative background image and gradient */}
          <div aria-hidden="true" className="absolute inset-0">
            <div className="absolute inset-0 mx-auto max-w-7xl overflow-hidden xl:px-8">
              <img
                alt=""
                src="/assets/images/khalisCover.jpg"
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-white/75" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white" />
          </div>

          {/* Testimonials */}
          <section
            aria-labelledby="testimonial-heading"
            className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
          >
            <div className="mx-auto max-w-2xl lg:max-w-none">
              <h2
                id="testimonial-heading"
                className="text-2xl font-bold tracking-tight text-gray-900"
              >
                What are people saying?
              </h2>

              <div className="mt-16 space-y-16 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:space-y-0">
                {testimonials.map((testimonial) => (
                  <blockquote key={testimonial.id} className="sm:flex lg:block">
                    <svg
                      width={24}
                      height={18}
                      viewBox="0 0 24 18"
                      aria-hidden="true"
                      className="shrink-0 text-gray-300"
                    >
                      <path
                        d="M0 18h8.7v-5.555c-.024-3.906 1.113-6.841 2.892-9.68L6.452 0C3.188 2.644-.026 7.86 0 12.469V18zm12.408 0h8.7v-5.555C21.083 8.539 22.22 5.604 24 2.765L18.859 0c-3.263 2.644-6.476 7.86-6.451 12.469V18z"
                        fill="currentColor"
                      />
                    </svg>
                    <div className="mt-8 sm:ml-6 sm:mt-0 lg:ml-0 lg:mt-10">
                      <p className="text-lg text-gray-600">
                        {testimonial.quote}
                      </p>
                      <cite className="mt-4 block font-semibold not-italic text-gray-900">
                        {testimonial.attribution}
                      </cite>
                    </div>
                  </blockquote>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer aria-labelledby="footer-heading" className="bg-white">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-200">
            <div className="pb-20 pt-16">
              <div className="flex justify-center">
                <img
                  alt=""
                  src="/assets/images/khalislogo.jpg"
                  className="h-16 w-auto"
                />
              </div>
              <div className="text-gray-500">
                Order and Inquiry: 0345-210-2501
              </div>
            </div>
          </div>

          <div className="py-10 md:flex md:items-center md:justify-between">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-500">
                &copy; 2025 All Rights Reserved
              </p>
            </div>

            <div className="mt-4 flex items-center justify-center md:mt-0">
              <div className="flex space-x-8">
                {footerNavigation.bottomLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-sm text-gray-500 hover:text-gray-600"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Product Modal */}
      {open && selectedProduct && (
        <ItemModal open={open} setOpen={setOpen} item={selectedProduct} />
      )}

      {/* Cart Modal */}
      <CartModal open={cartOpen} setOpen={setCartOpen} />
    </div>
  );
}
