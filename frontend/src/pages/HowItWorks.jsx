import React from "react";
import { FaUserPlus, FaSearch, FaHandshake, FaArrowRight } from "react-icons/fa";

const HowItWorks = () => {
  return (
    <section className="min-h-screen bg-gradient-to-b from-rose-50 via-rose-50 to-white w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          <span className="bg-gradient-to-r from-[#2874A6] to-[#16527a] bg-clip-text text-transparent">
            How SkillSwap Works
          </span>
        </h1>
        <p className="text-lg text-gray-700 mb-12">
          Get started in three simple steps—share what you know, learn what you love.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Step 1 */}
          <div className="group bg-white rounded-2xl border border-rose-100 shadow-sm p-8 transition-all hover:-translate-y-1 hover:shadow-lg">
            <span className="mb-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-100">
              Step 1
            </span>
            <div className="mb-4 grid place-items-center">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#2874A6]/10 text-[#2874A6]">
                <FaUserPlus className="text-2xl" aria-hidden="true" />
              </span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Create an Account</h2>
            <p className="text-gray-600">
              Sign up for free and set up your profile with the skills you can share and the skills you want to learn.
            </p>
          </div>

          {/* Step 2 */}
          <div className="group bg-white rounded-2xl border border-rose-100 shadow-sm p-8 transition-all hover:-translate-y-1 hover:shadow-lg">
            <span className="mb-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-100">
              Step 2
            </span>
            <div className="mb-4 grid place-items-center">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#2874A6]/10 text-[#2874A6]">
                <FaSearch className="text-2xl" aria-hidden="true" />
              </span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Browse Skills</h2>
            <p className="text-gray-600">
              Explore a variety of skills offered by others. Filter by category or search for something specific.
            </p>
          </div>

          {/* Step 3 */}
          <div className="group bg-white rounded-2xl border border-rose-100 shadow-sm p-8 transition-all hover:-translate-y-1 hover:shadow-lg">
            <span className="mb-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-100">
              Step 3
            </span>
            <div className="mb-4 grid place-items-center">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#2874A6]/10 text-[#2874A6]">
                <FaHandshake className="text-2xl" aria-hidden="true" />
              </span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Swap Skills</h2>
            <p className="text-gray-600">
              Connect with members, arrange sessions, and start learning and teaching together.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-[#2874A6] px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#16527a] hover:shadow focus:outline-none focus:ring-2 focus:ring-[#2874A6]/60 focus:ring-offset-2 focus:ring-offset-white"
          >
            Get started
            <FaArrowRight className="text-xs" />
          </a>
          <a
            href="/faq"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#2874A6]/40"
          >
            Learn more
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;