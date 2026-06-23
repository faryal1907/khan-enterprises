"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { theme } from "@/lib/colors";

// ── Animation variants ──────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

const slideFromLeft = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0 },
};

const slideFromRight = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0 },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1 },
};

const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const growLine = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1 },
};

// Small centered line — kept only under section headings
function AccentLine({ width = "4rem" }: { width?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={growLine}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="h-[3px] rounded-full mx-auto"
      style={{
        width,
        backgroundColor: theme.accents.secondary,
        transformOrigin: "center",
      }}
    />
  );
}

export default function Home() {
  return (
    <div style={{ backgroundColor: theme.backgrounds.primary }} className="min-h-screen">

      {/* Hero Section */}
      <section className="py-20 md:py-28 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6">

          {/* Headline — fades up on load */}
          <motion.h1
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-bold text-center leading-tight mb-6"
            style={{ color: theme.text.primary }}
          >
            Find Your Next{" "}
            <span className="italic" style={{ color: theme.accents.secondary }}>
              Ride
            </span>
          </motion.h1>

          <motion.div
            initial="hidden"
            animate="show"
            variants={growLine}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="h-[3px] w-12 rounded-full mx-auto mb-16"
            style={{ backgroundColor: theme.accents.secondary, transformOrigin: "center" }}
          />

          {/* Bike Image with floating callouts — irregular, non-grid placement */}
          <div className="relative flex justify-center mb-24 md:mb-32">

            {/* Callout — upper left, tilted card with left-border */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={slideFromLeft}
              transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
              className="hidden md:block absolute left-2 top-6 -translate-x-4 -rotate-3 z-10"
            >
              <div
                className="px-4 py-3 rounded-xl shadow-lg backdrop-blur-sm"
                style={{
                  backgroundColor: theme.backgrounds.primary,
                  border: `1px solid ${theme.borders.light}`,
                  borderLeftWidth: "4px",
                  borderLeftColor: theme.accents.secondary,
                }}
              >
                <p className="text-xs font-semibold" style={{ color: theme.text.secondary }}>
                  Verified Inventory
                </p>
                <p className="text-sm font-bold" style={{ color: theme.text.primary }}>
                  100% Chassis Checked
                </p>
              </div>
            </motion.div>

            {/* Callout — lower left, pill-style, no left-border, different chrome entirely */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={slideFromLeft}
              transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
              className="hidden md:block absolute left-10 bottom-16 translate-x-2 z-10"
            >
              <div
                className="px-3 py-2 rounded-full shadow-md flex items-center gap-2"
                style={{ backgroundColor: theme.colors.limeSoft }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.accents.secondary }} />
                <p className="text-xs font-bold" style={{ color: theme.colors.gray900 }}>
                  Free Delivery upto 10km
                </p>
              </div>
            </motion.div>

            {/* Callout — upper right, tilted opposite way, full border instead of left-only */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={slideFromRight}
              transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
              className="hidden md:block absolute right-4 top-2 translate-x-4 rotate-2 z-10"
            >
              <div
                className="px-4 py-3 rounded-xl shadow-lg backdrop-blur-sm"
                style={{
                  backgroundColor: theme.colors.gray900,
                  border: `1px solid ${theme.accents.primary}`,
                }}
              >
                <p className="text-xs font-semibold" style={{ color: theme.colors.white, opacity: 0.7 }}>
                  2% OFF
                </p>
                <p className="text-sm font-bold" style={{ color: theme.colors.white }}>
                  on online orders
                </p>
              </div>
            </motion.div>

            {/* Callout — lower right */}
            <motion.div
  initial="hidden"
  animate="show"
  variants={slideFromRight}
  transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}
  className="hidden md:block absolute right-2 bottom-24 translate-x-2 rotate-1 z-10"
>
  <div
    className="px-4 py-3 rounded-xl shadow-lg flex items-center gap-3"
    style={{
      backgroundColor: theme.backgrounds.primary,
      border: `1px solid ${theme.borders.light}`,
      borderLeftWidth: "4px",
      borderLeftColor: theme.accents.secondary,
    }}
  >

    <div>
      <p
        className="text-sm font-bold"
        style={{ color: theme.text.primary }}
      >
        Quality Checked
      </p>
    </div>
  </div>
</motion.div>

            {/* Callout — bottom center pill, fades up last, offset slightly off-center */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
              className="hidden md:block absolute -bottom-4 left-1/2 -translate-x-[60%] z-10"
            >
              <div
                className="px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2"
                style={{
                  backgroundColor: theme.colors.gray900,
                  color: theme.colors.white,
                }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.accents.secondary }} />
                <p className="text-xs font-semibold">Live across 2 branches</p>
              </div>
            </motion.div>

            {/* Bike image — scales in */}
            <motion.img
              initial="hidden"
              animate="show"
              variants={scaleIn}
              transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
              src="https://res.cloudinary.com/dubgzbyz0/image/upload/v1781621453/three-bikes_uydimg.png"
              alt="Featured Motorcycle"
              className="w-full max-w-2xl h-auto object-contain"
            />
          </div>

          {/* Product Card — fades up after image settles, now with breathing room above */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            className="rounded-3xl p-8 md:p-12"
            style={{
              backgroundColor: theme.colors.limeSoft,
              borderLeftWidth: "4px",
              borderLeftColor: theme.accents.secondary,
              borderStyle: "solid",
              borderTopWidth: 0,
              borderRightWidth: 0,
              borderBottomWidth: 0,
            }}
          >
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left - Model Info */}
              <div>
                <h2
                  className="text-3xl md:text-4xl font-bold mb-2"
                  style={{ color: theme.colors.gray900 }}
                >
                  Browse Bikes and Parts
                </h2>
                <p className="text-sm font-semibold mb-6" style={{ color: theme.colors.gray700 }}>
                  From trusted dealership
                </p>
                <p className="text-lg leading-relaxed" style={{ color: theme.colors.gray800 }}>
                  Secure the best deals, and get nationwide delivery, free upto 10km from nearest branch! Browse premium bikes and parts, filter with respect to branch and quantity with transparency!
                </p>
              </div>

              {/* Right - Stats & Button */}
              <div className="flex flex-col justify-between">
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div>
                    <div className="text-2xl font-bold" style={{ color: theme.colors.gray900 }}>
                      10/10
                    </div>
                    <p className="text-xs font-medium" style={{ color: theme.colors.gray700 }}>
                      Quality
                    </p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold" style={{ color: theme.colors.gray900 }}>
                      2
                    </div>
                    <p className="text-xs font-medium" style={{ color: theme.colors.gray700 }}>
                      Locations
                    </p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold" style={{ color: theme.colors.gray900 }}>
                      24/7
                    </div>
                    <p className="text-xs font-medium" style={{ color: theme.colors.gray700 }}>
                      Support
                    </p>
                  </div>
                </div>

                <Link
                  href="/bikes"
                  className="px-8 py-3 rounded-full font-bold transition-all text-center hover:opacity-90"
                  style={{
                    backgroundColor: theme.colors.gray900,
                    color: theme.colors.white,
                  }}
                >
                  Explore More
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Payment Options Section */}
      <section className="py-20 border-t" style={{ backgroundColor: theme.backgrounds.secondary, borderColor: theme.borders.light }}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-4xl font-bold text-center mb-4"
            style={{ color: theme.text.primary }}
          >
            Payment Options
          </motion.h2>
          <AccentLine />
          <motion.p
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="text-lg text-center mt-6 mb-12 max-w-2xl mx-auto"
            style={{ color: theme.text.secondary }}
          >
            Multiple payment methods available for your convenience
          </motion.p>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {/* Card 1 — left-border style (kept) */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="p-6 rounded-xl border transition-all hover:shadow-md"
              style={{
                backgroundColor: theme.backgrounds.primary,
                borderColor: theme.borders.light,
                borderLeftWidth: "4px",
                borderLeftColor: theme.accents.primary,
              }}
            >
              <h3 className="text-lg font-bold mb-2" style={{ color: theme.text.primary }}>
                Cash Payment
              </h3>
              <p style={{ color: theme.text.secondary }} className="text-sm">
                Direct payment with instant confirmation
              </p>
            </motion.div>

            {/* Card 2 — solid tinted background, no border at all */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="p-6 rounded-xl transition-all hover:shadow-md"
              style={{ backgroundColor: theme.colors.limeSoft }}
            >
              <h3 className="text-lg font-bold mb-2" style={{ color: theme.colors.gray900 }}>
                Bank Transfer
              </h3>
              <p style={{ color: theme.colors.gray700 }} className="text-sm">
                Secure transfers with full tracking
              </p>
            </motion.div>

            {/* Card 3 — full border all around, dark variant */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="p-6 rounded-xl transition-all hover:shadow-md"
              style={{
                backgroundColor: theme.accents.primary,
              }}
            >
              <h3 className="text-lg font-bold mb-2" style={{ color: theme.colors.white }}>
                SafePay
              </h3>
              <p style={{ color: theme.colors.white, opacity: 0.7 }} className="text-sm">
                Visa/Mastercard debit & credit cards
              </p>
            </motion.div>

            {/* Card 4 — outline only, top accent instead of left */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="p-6 rounded-xl border-2 transition-all hover:shadow-md relative overflow-hidden"
              style={{
                backgroundColor: theme.backgrounds.primary,
                borderColor: theme.accents.secondary,
              }}
            >
              <h3 className="text-lg font-bold mb-2" style={{ color: theme.text.primary }}>
                JazzCash
              </h3>
              <p style={{ color: theme.text.secondary }} className="text-sm">
                Mobile wallet for convenience
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Locations Section */}
      <section id="locations" className="py-20 border-t" style={{ borderColor: theme.borders.light }}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-4xl font-bold text-center mb-4"
            style={{ color: theme.text.primary }}
          >
            Visit Our Locations
          </motion.h2>
          <AccentLine />

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mt-12"
          >
            {[
              {
                branch: "Islamabad Branch",
                address: "Nogazi Shop, Fateh Jang Road, Near Faisal Town, Islamabad",
              },
              {
                branch: "Tordher Branch",
                address: "Near Byco Petrol Pump, Swabi, Jhangira Road, Tordher, District Swabi",
              },
            ].map((loc, idx) => (
              <motion.div
                key={idx}
                variants={idx === 0 ? slideFromLeft : slideFromRight}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="p-6 rounded-xl border"
                style={{
                  backgroundColor: theme.backgrounds.secondary,
                  borderColor: theme.borders.light,
                  borderLeftWidth: "4px",
                  borderLeftColor: idx === 0 ? theme.accents.primary : theme.accents.secondary,
                }}
              >
                <h3 className="text-xl font-bold mb-2" style={{ color: theme.text.primary }}>
                  {loc.branch}
                </h3>
                <p style={{ color: theme.text.secondary }}>{loc.address}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Vendors Section */}
      <section className="py-20 border-t" style={{ backgroundColor: theme.backgrounds.secondary, borderColor: theme.borders.light }}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-4xl font-bold text-center mb-4"
            style={{ color: theme.text.primary }}
          >
            Our Trusted Vendors
          </motion.h2>
          <AccentLine />
          <motion.p
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="text-lg text-center mt-6 mb-16 max-w-2xl mx-auto"
            style={{ color: theme.text.secondary }}
          >
            We partner with industry-leading manufacturers to bring you the best selection of motorcycles and electric vehicles
          </motion.p>

          <div className="flex flex-col gap-8 max-w-4xl mx-auto">

            {/* EVEE — logo left, text right, green left-border */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideFromLeft}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="p-8 rounded-xl border flex flex-col md:flex-row items-center gap-8"
              style={{
                backgroundColor: theme.backgrounds.primary,
                borderColor: theme.borders.light,
                borderLeftWidth: "4px",
                borderLeftColor: theme.accents.secondary,
              }}
            >
              <img
                src="https://res.cloudinary.com/dubgzbyz0/image/upload/v1782035704/evee-logo_round-500x494_ygddkv.png"
                alt="EVEE Logo"
                className="w-32 h-32 object-contain flex-shrink-0"
              />
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold mb-3" style={{ color: theme.text.primary }}>
                  EVEE
                </h3>
                <p style={{ color: theme.text.secondary }} className="text-sm leading-relaxed">
                  Revolutionizing urban transport with stylish, affordable, and eco-friendly electric scooters. EVEE is committed to sustainable mobility and reducing carbon footprints across Pakistan.
                </p>
              </div>
            </motion.div>

            {/* Road King — logo right, text left, dark variant for contrast */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideFromRight}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="p-8 rounded-xl flex flex-col md:flex-row-reverse items-center gap-8"
              style={{ backgroundColor: theme.colors.white, borderColor: theme.borders.dark }}
            >
              <img
                src="https://res.cloudinary.com/dubgzbyz0/image/upload/v1782035711/RoadKing-Logo_xbxh5n.png"
                alt="Road King Logo"
                className="w-32 h-32 object-contain flex-shrink-0 rounded-lg bg-white p-2"
              />
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold mb-3" style={{ color: theme.backgrounds.dark }}>
                  Road King
                </h3>
                <p style={{ color: theme.backgrounds.dark, opacity: 0.75 }} className="text-sm leading-relaxed">
                  A pioneering EV company leading Pakistan's electric vehicle revolution. With 400+ dealerships nationwide and monthly capacity of 10,000+ units, Road King is advancing sustainable 2-wheeler and 3-wheeler transportation.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-4xl font-bold text-center mb-4"
            style={{ color: theme.text.primary }}
          >
            Get in Touch
          </motion.h2>
          <AccentLine />

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-8 mt-12"
          >
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="p-8 rounded-xl border"
              style={{
                backgroundColor: theme.backgrounds.secondary,
                borderColor: theme.borders.light,
                borderLeftWidth: "4px",
                borderLeftColor: theme.backgrounds.dark,
              }}
            >
              <div className="flex items-start gap-3 mb-4">
                <svg className="w-5 h-5 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" style={{ color: theme.accents.primary }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <svg className="w-5 h-5 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: theme.accents.primary }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <a
                href="tel:+923119143977"
                className="text-2xl font-bold transition-opacity hover:opacity-70"
                style={{ color: theme.accents.primary }}
              >
                +92 3119 143977
              </a>
            </motion.div>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="p-8 rounded-xl"
              style={{ backgroundColor: theme.backgrounds.dark }}
            >
              <div className="flex items-start gap-3 mb-4">
                <svg className="w-5 h-5 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" style={{ color: theme.accents.tertiary }}>
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
                </svg>
              </div>
              <a
                href="mailto:ghulam.ali9366@gmail.com"
                className="text-lg font-bold transition-opacity hover:opacity-70 break-all"
                style={{ color: theme.accents.tertiary }}
              >
                ghulam.ali9366@gmail.com
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12" style={{ backgroundColor: theme.backgrounds.primary, borderColor: theme.borders.light }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 mb-8">
            {/* About */}
            <div>
              <h4 className="font-bold mb-4" style={{ color: theme.text.primary }}>
                Ali and Khan&apos;s
              </h4>
              <p style={{ color: theme.text.secondary }} className="text-sm leading-relaxed">
                Your trusted motorcycle dealership partner. Browse premium bikes and parts, place orders, track status, and get nationwide delivery, free upto 10km!
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-4" style={{ color: theme.text.primary }}>
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/bikes" style={{ color: theme.text.secondary }} className="text-sm hover:opacity-70">
                    Browse Bikes
                  </Link>
                </li>
                <li>
                  <Link href="#locations" style={{ color: theme.text.secondary }} className="text-sm hover:opacity-70">
                    Locations
                  </Link>
                </li>
                <li>
                  <Link href="#contact" style={{ color: theme.text.secondary }} className="text-sm hover:opacity-70">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-bold mb-4" style={{ color: theme.text.primary }}>
                Contact
              </h4>
              <ul className="space-y-2">
                <li style={{ color: theme.text.secondary }} className="text-sm">
                  Phone: <a href="tel:+923119143977" className="hover:opacity-70">+92 3119 143977</a>
                </li>
                <li style={{ color: theme.text.secondary }} className="text-sm">
                  Email: <a href="mailto:ghulam.ali9366@gmail.com" className="hover:opacity-70">ghulam.ali9366@gmail.com</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8" style={{ borderColor: theme.borders.light }}>
            <p style={{ color: theme.text.secondary }} className="text-sm text-center">
              © 2026 Ali and Khan&apos;s. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}