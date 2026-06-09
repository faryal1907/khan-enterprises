"use client";
import Link from "next/link";
import { theme } from "@/lib/colors";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Premium Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: theme.backgrounds.dark }}
      >
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1
              className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
              style={{ color: theme.text.inverse }}
            >
              Premium Motorcycles,
              <br />
              Trusted Service
            </h1>
            <p
              className="text-xl mb-8 leading-relaxed"
              style={{ color: theme.colors.sky }}
            >
              Browse our exclusive inventory of premium motorcycles. Make an offer, track your order, and experience seamless delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/bikes"
                className="inline-block px-8 py-4 text-base font-semibold rounded-lg text-center hover:opacity-90 transition-opacity"
                style={{
                  backgroundColor: theme.accents.primary,
                  color: theme.text.inverse,
                }}
              >
                Browse Motorcycles
              </Link>
              <Link
                href="/parts"
                className="inline-block px-8 py-4 text-base font-semibold rounded-lg text-center hover:opacity-90 transition-opacity"
                style={{
                  backgroundColor: theme.accents.secondary,
                  color: theme.text.inverse,
                }}
              >
                Parts & Accessories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Buy From Us */}
      <section className="py-20" style={{ backgroundColor: theme.backgrounds.secondary }}>
        <div className="max-w-7xl mx-auto px-6">
          <h2
            className="text-4xl font-bold mb-4 text-center"
            style={{ color: theme.text.primary }}
          >
            Why Buy From Us
          </h2>
          <p
            className="text-lg text-center mb-12 max-w-2xl mx-auto"
            style={{ color: theme.text.secondary }}
          >
            We combine premium inventory with transparent pricing and exceptional service.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Transparent Pricing",
                description: "Make offers with confidence. No hidden fees, clear negotiation process.",
              },
              {
                title: "Quality Assurance",
                description: "Every motorcycle undergoes thorough inspection before listing.",
              },
              {
                title: "Fast Delivery",
                description: "Track your delivery in real-time from approval to doorstep.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="rounded-xl p-6"
                style={{
                  backgroundColor: theme.backgrounds.primary,
                  border: `1px solid ${theme.borders.light}`,
                }}
              >
                <h3
                  className="text-xl font-semibold mb-3"
                  style={{ color: theme.text.primary }}
                >
                  {feature.title}
                </h3>
                <p style={{ color: theme.text.secondary }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Inventory Highlights */}
      <section className="py-20" style={{ backgroundColor: theme.backgrounds.primary }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2
                className="text-4xl font-bold mb-2"
                style={{ color: theme.text.primary }}
              >
                Featured Motorcycles
              </h2>
              <p style={{ color: theme.text.secondary }}>
                Browse our latest available inventory
              </p>
            </div>
            <Link
              href="/bikes"
              className="inline-block px-6 py-3 text-base font-medium rounded-lg hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: theme.accents.secondary,
                color: theme.text.inverse,
              }}
            >
              View All
            </Link>
          </div>

          {/* Placeholder for featured bikes - will be populated with API data */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden"
                style={{
                  backgroundColor: theme.backgrounds.secondary,
                  border: `1px solid ${theme.borders.light}`,
                }}
              >
                <div
                  className="aspect-video"
                  style={{ backgroundColor: theme.backgrounds.tertiary }}
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-xs font-medium px-2 py-1 rounded"
                      style={{
                        backgroundColor: `${theme.accents.tertiary}30`,
                        color: theme.accents.primary,
                      }}
                    >
                      Available
                    </span>
                    <span className="text-sm" style={{ color: theme.text.muted }}>
                      Model Year
                    </span>
                  </div>
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ color: theme.text.primary }}
                  >
                    Motorcycle Model Name
                  </h3>
                  <p className="text-sm mb-4" style={{ color: theme.text.secondary }}>
                    Brand Name
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-2xl font-bold"
                      style={{ color: theme.text.primary }}
                    >
                      PKR 000,000
                    </span>
                    <Link
                      href="/bikes"
                      className="inline-block px-4 py-2 text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                      style={{
                        backgroundColor: theme.accents.primary,
                        color: theme.text.inverse,
                      }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Financing / Payment Options */}
      <section className="py-20" style={{ backgroundColor: theme.backgrounds.secondary }}>
        <div className="max-w-7xl mx-auto px-6">
          <h2
            className="text-4xl font-bold mb-4 text-center"
            style={{ color: theme.text.primary }}
          >
            Flexible Payment Options
          </h2>
          <p
            className="text-lg text-center mb-12 max-w-2xl mx-auto"
            style={{ color: theme.text.secondary }}
          >
            Choose from multiple secure payment methods tailored to your needs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                title: "Cash Payment",
                description: "Direct payment with immediate confirmation.",
              },
              {
                title: "Bank Transfer",
                description: "Secure bank transfer with tracking.",
              },
              {
                title: "SafePay",
                description: "Visa/Mastercard debit & credit cards.",
              },
              {
                title: "JazzCash",
                description: "Mobile wallet payments for convenience.",
              },
            ].map((option, index) => (
              <div
                key={index}
                className="rounded-xl p-6"
                style={{
                  backgroundColor: theme.backgrounds.primary,
                  border: `1px solid ${theme.borders.light}`,
                }}
              >
                <h3
                  className="text-xl font-semibold mb-2"
                  style={{ color: theme.text.primary }}
                >
                  {option.title}
                </h3>
                <p style={{ color: theme.text.secondary }}>{option.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20"
        style={{ backgroundColor: theme.backgrounds.primary }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2
            className="text-4xl font-bold mb-4"
            style={{ color: theme.text.primary }}
          >
            Ready to Find Your Perfect Motorcycle?
          </h2>
          <p
            className="text-lg mb-8"
            style={{ color: theme.text.secondary }}
          >
            Browse our inventory, make an offer, and experience premium service.
          </p>
          <Link
            href="/bikes"
            className="inline-block px-8 py-4 text-base font-semibold rounded-lg hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: theme.accents.primary,
              color: theme.text.inverse,
            }}
          >
            Browse Inventory
          </Link>
        </div>
      </section>
    </div>
  );
}
