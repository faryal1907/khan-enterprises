"use client";

import Link from "next/link";
import { theme } from "@/lib/colors";

export default function Home() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "#f8f8f8",
      }}
    >
      {/* Hero */}
      <section className="overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 pt-8 md:pt-12">
          {/* Text */}
          <div className="max-w-3xl mx-auto text-center">
            <h1
              className="text-3xl md:text-5xl font-bold tracking-tight leading-tight"
              style={{ color: theme.text.primary }}
            >
              Find Your Next Ride
            </h1>

            {/* Lime accent bar for harmony */}
            <div
              className="mx-auto mt-4 h-1 w-20 rounded-full"
              style={{ backgroundColor: theme.accents.secondary }}
            />

            <p
              className="mt-4 text-base md:text-lg"
              style={{ color: theme.text.secondary }}
            >
              Browse bikes and parts from trusted dealership.
              <br />
              Make offers, secure the best deal, and get nationwide delivery.
            </p>

            <div className="mt-6">
              <Link
                href="/bikes"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                style={{
                  backgroundColor: theme.accents.primary,
                  color: theme.text.inverse,
                }}
              >
                Browse Inventory
              </Link>
            </div>
          </div>

          {/* Hero Bikes Image */}
          <div className="mt-8 flex justify-center">
            <img
              src="https://evee.pk/wp-content/uploads/2025/01/Footer.png"
              alt="Featured Motorcycles"
              className="
                w-full
                max-w-3xl
                h-auto
                object-contain
                select-none
                pointer-events-none
              "
            />
          </div>
        </div>
      </section>

      {/* Branch Addresses */}
      <section className="py-20" style={{ backgroundColor: theme.backgrounds.secondary }}>
        <div className="max-w-7xl mx-auto px-6">
          <h2
            className="text-4xl font-bold mb-4 text-center"
            style={{ color: theme.text.primary }}
          >
            Our Branches
          </h2>
          <div
            className="mx-auto mb-4 h-1 w-16 rounded-full"
            style={{ backgroundColor: theme.accents.secondary }}
          />
          <p
            className="text-lg text-center mb-12 max-w-2xl mx-auto"
            style={{ color: theme.text.secondary }}
          >
            Visit us at our convenient locations
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div
              className="rounded-xl p-6"
              style={{
                backgroundColor: theme.backgrounds.primary,
                border: `1px solid ${theme.borders.light}`,
                borderTopWidth: "3px",
                borderTopColor: theme.accents.secondary,
              }}
            >
              <h3
                className="text-xl font-semibold mb-3"
                style={{ color: theme.text.primary }}
              >
                Islamabad Branch
              </h3>
              <p style={{ color: theme.text.secondary }}>
                Noghazi Shop, Fateh Jang Road, Near Faisal Town, Islamabad
              </p>
            </div>
            <div
              className="rounded-xl p-6"
              style={{
                backgroundColor: theme.backgrounds.primary,
                border: `1px solid ${theme.borders.light}`,
                borderTopWidth: "3px",
                borderTopColor: theme.accents.secondary,
              }}
            >
              <h3
                className="text-xl font-semibold mb-3"
                style={{ color: theme.text.primary }}
              >
                Tordher Branch
              </h3>
              <p style={{ color: theme.text.secondary }}>
                Near Byco Petrol Pump, Swabi, Jhangira Road, Tordher, District Swabi
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Options */}
      <section className="py-20" style={{ backgroundColor: theme.backgrounds.primary }}>
        <div className="max-w-7xl mx-auto px-6">
          <h2
            className="text-4xl font-bold mb-4 text-center"
            style={{ color: theme.text.primary }}
          >
            Payment Options
          </h2>
          <div
            className="mx-auto mb-4 h-1 w-16 rounded-full"
            style={{ backgroundColor: theme.accents.secondary }}
          />
          <p
            className="text-lg text-center mb-12 max-w-2xl mx-auto"
            style={{ color: theme.text.secondary }}
          >
            Integration into website coming soon!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { title: "Cash Payment", description: "Direct payment with immediate confirmation." },
              { title: "Bank Transfer", description: "Secure bank transfer with tracking." },
              { title: "SafePay", description: "Visa/Mastercard debit & credit cards." },
              { title: "JazzCash", description: "Mobile wallet payments for convenience." },
            ].map((option, index) => (
              <div
                key={index}
                className="rounded-xl p-6"
                style={{
                  backgroundColor: theme.backgrounds.secondary,
                  border: `1px solid ${theme.borders.light}`,
                  borderTopWidth: "3px",
                  borderTopColor: theme.accents.secondary,
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

      {/* Contact Us */}
      <section className="py-20" style={{ backgroundColor: theme.backgrounds.secondary }}>
        <div className="max-w-7xl mx-auto px-6">
          <h2
            className="text-4xl font-bold mb-4 text-center"
            style={{ color: theme.text.primary }}
          >
            Contact Us for Help
          </h2>
          <div
            className="mx-auto mb-4 h-1 w-16 rounded-full"
            style={{ backgroundColor: theme.accents.secondary }}
          />
          <p
            className="text-lg text-center mb-12 max-w-2xl mx-auto"
            style={{ color: theme.text.secondary }}
          >
            {"We're here to assist you with any questions"}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div
              className="rounded-xl p-6"
              style={{
                backgroundColor: theme.backgrounds.primary,
                border: `1px solid ${theme.borders.light}`,
                borderTopWidth: "3px",
                borderTopColor: theme.accents.secondary,
              }}
            >
              <h3
                className="text-xl font-semibold mb-3"
                style={{ color: theme.text.primary }}
              >
                Phone/Whatsapp
              </h3>
              <a
                href="tel:+923119143977"
                className="text-lg hover:opacity-80 transition-opacity"
                style={{ color: theme.accents.primary }}
              >
                +92 3119143977
              </a>
            </div>
            <div
              className="rounded-xl p-6"
              style={{
                backgroundColor: theme.backgrounds.primary,
                border: `1px solid ${theme.borders.light}`,
                borderTopWidth: "3px",
                borderTopColor: theme.accents.secondary,
              }}
            >
              <h3
                className="text-xl font-semibold mb-3"
                style={{ color: theme.text.primary }}
              >
                Email
              </h3>
              <a
                href="mailto:ghulam.ali@gmail.com"
                className="text-lg hover:opacity-80 transition-opacity"
                style={{ color: theme.accents.primary }}
              >
                ghulam.ali@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
