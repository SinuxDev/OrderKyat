"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Facebook } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
      className="relative z-10 border-t border-slate-200 bg-white/80 backdrop-blur-sm mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* ✅ Changed to 3 columns on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand Section - Takes 2 columns on tablet */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              OrderKyat 🇲🇲
            </h3>
            <p className="text-sm text-slate-600 max-w-xs">
              Myanmar&apos;s Smart Invoice Generator. Transform chat messages
              into professional invoices instantly.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/SinuxDev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-slate-900 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/sinuxdev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-blue-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/sinux.1738"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-blue-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 sm:mb-4 text-sm sm:text-base">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <button
                  onClick={() => scrollToSection("trust-section")}
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("pricing-section")}
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("hero-section")}
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  How It Works
                </button>
              </li>
            </ul>
          </div>

          {/* Author Links */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 sm:mb-4 text-sm sm:text-base">
              Author
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link
                  href="https://github.com/SinuxDev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors"
                >
                  About Me
                </Link>
              </li>
              <li>
                <a
                  href="mailto:aung.yehtet1738@gmail.com"
                  className="hover:text-blue-600 transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <Link
                  href="https://github.com/SinuxDev?tab=repositories"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors"
                >
                  Other Projects
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="w-full text-center space-y-2">
            <p className="text-xs sm:text-sm text-slate-600">
              © {currentYear}{" "}
              <strong className="text-slate-900">Aung Ye Htet</strong>
              <span className="hidden sm:inline text-slate-400 mx-1.5">·</span>
              <br className="sm:hidden" />
              <a
                href="https://github.com/SinuxDev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                @SinuxDev
              </a>
            </p>
            <p className="text-xs sm:text-sm text-slate-500">
              Bridging the gap between business logic and binary
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
