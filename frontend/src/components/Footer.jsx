import React from "react";
import {
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
  FaFacebookF,
  FaArrowRight,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative w-full bg-white text-[#222] text-[15px] font-[Arial,sans-serif] border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="mb-3 text-2xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-[#2874A6] to-[#16527a] bg-clip-text text-transparent">
                SkillSwap
              </span>
            </h3>
            <p className="leading-relaxed text-slate-600">
              Teach what you know, learn what you want — exchange skills with
              people in your community.
            </p>

            {/* Socials */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="https://www.instagram.com/"
                aria-label="Instagram"
                title="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="group grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-white text-[#C13584] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#2874A6]/40"
              >
                <FaInstagram className="transition-transform group-hover:scale-110" />
              </a>
              <a
                href="https://x.com/"
                aria-label="Twitter"
                title="Twitter / X"
                target="_blank"
                rel="noopener noreferrer"
                className="group grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-white text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#2874A6]/40"
              >
                <FaTwitter className="transition-transform group-hover:scale-110" />
              </a>
              <a
                href="https://www.whatsapp.com/"
                aria-label="WhatsApp"
                title="WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
                className="group grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-white text-[#25D366] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#2874A6]/40"
              >
                <FaWhatsapp className="transition-transform group-hover:scale-110" />
              </a>
              <a
                href="https://www.facebook.com/"
                aria-label="Facebook"
                title="Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="group grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-white text-[#1877F2] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#2874A6]/40"
              >
                <FaFacebookF className="transition-transform group-hover:scale-110" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-[#222]">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/about"
                  className="group inline-flex items-center gap-2 text-slate-600 transition-colors hover:text-slate-900"
                >
                  <span>About Us</span>
                  <FaArrowRight className="translate-x-[-4px] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </a>
              </li>
              <li>
                <a
                  href="/works"
                  className="group inline-flex items-center gap-2 text-slate-600 transition-colors hover:text-slate-900"
                >
                  <span>How It Works</span>
                  <FaArrowRight className="translate-x-[-4px] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="group inline-flex items-center gap-2 text-slate-600 transition-colors hover:text-slate-900"
                >
                  <span>FAQ</span>
                  <FaArrowRight className="translate-x-[-4px] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="group inline-flex items-center gap-2 text-slate-600 transition-colors hover:text-slate-900"
                >
                  <span>Contact</span>
                  <FaArrowRight className="translate-x-[-4px] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-[#222]">Contact</h3>
            <div className="leading-relaxed">
              <p className="mb-2">Email</p>
              <a
                href="mailto:contact@skillswap.com"
                className="inline-block rounded-lg text-[#2874A6] underline decoration-[#2874A6]/40 underline-offset-4 transition hover:text-[#16527a] hover:decoration-[#16527a] focus:outline-none focus:ring-2 focus:ring-[#2874A6]/50 focus:ring-offset-2 focus:ring-offset-white"
              >
                contact@skillswap.com
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-[#222]">Stay in the loop</h3>
            <p className="text-slate-600">
              Get tips, stories, and updates. No spam—unsubscribe anytime.
            </p>
            <form
              className="mt-4"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="you@example.com"
                  aria-label="Email address"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-[15px] text-[#222] placeholder-slate-400 shadow-sm transition focus:border-[#2874A6] focus:outline-none focus:ring-4 focus:ring-[#2874A6]/10"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#2874A6] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#16527a] hover:shadow focus:outline-none focus:ring-2 focus:ring-[#2874A6]/60 focus:ring-offset-2 focus:ring-offset-white"
                >
                  Subscribe
                  <FaArrowRight />
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                By subscribing, you agree to our Terms and Privacy Policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;