import Link from "next/link";
import { theme } from "@/lib/colors";

export function Footer() {
  return (
    <footer className="border-t py-10 sm:py-12" style={{ backgroundColor: theme.backgrounds.primary, borderColor: theme.borders.light }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6 sm:mb-8">
          {/* About */}
          <div>
            <h4 className="font-bold mb-3 sm:mb-4" style={{ color: theme.text.primary }}>
              Ali and Khan&apos;s
            </h4>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: theme.text.secondary }}>
              Your trusted motorcycle dealership partner. Browse premium bikes and parts, place orders, track status, and get nationwide delivery, free upto 10km!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-3 sm:mb-4" style={{ color: theme.text.primary }}>
              Quick Links
            </h4>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link href="/bikes" style={{ color: theme.text.secondary }} className="text-xs sm:text-sm hover:opacity-70">
                  Browse Bikes
                </Link>
              </li>
              <li>
                <Link href="/#locations" style={{ color: theme.text.secondary }} className="text-xs sm:text-sm hover:opacity-70">
                  Locations
                </Link>
              </li>
              <li>
                <Link href="/#contact" style={{ color: theme.text.secondary }} className="text-xs sm:text-sm hover:opacity-70">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold mb-3 sm:mb-4" style={{ color: theme.text.primary }}>
              Contact
            </h4>
            <ul className="space-y-1.5 sm:space-y-2">
              <li className="text-xs sm:text-sm" style={{ color: theme.text.secondary }}>
                Phone: <a href="tel:+923119143977" className="hover:opacity-70">+92 3119 143977</a>
              </li>
              <li className="text-xs sm:text-sm" style={{ color: theme.text.secondary }}>
                Email: <a href="mailto:ghulam.ali9366@gmail.com" className="hover:opacity-70">ghulam.ali9366@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-6 sm:pt-8" style={{ borderColor: theme.borders.light }}>
          <p className="text-xs sm:text-sm text-center" style={{ color: theme.text.secondary }}>
            © 2026 Ali and Khan&apos;s. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}