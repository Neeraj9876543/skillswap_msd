import React from "react";
import { FaLightbulb, FaFlagCheckered } from "react-icons/fa";

const About = () => {
  return (
    <section className="min-h-screen bg-gradient-to-b from-rose-50 via-rose-50 to-white w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          <span className="bg-gradient-to-r from-[#2874A6] to-[#16527a] bg-clip-text text-transparent">
            About SkillSwap
          </span>
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mb-10">
          SkillSwap is a community-driven platform that empowers people to share what they know and learn what they want — all without spending money.
          Whether you’re teaching photography, learning coding, or swapping cooking tips, our goal is to connect skill-sharers worldwide.
        </p>

        {/* Team */}
        <h2 className="text-2xl font-semibold text-[#2874A6] mb-4">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1 */}
          <div className="group bg-white rounded-2xl border border-rose-100 shadow-sm p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lg">
            <img
              src="/team1.jpg"
              alt="G. Neeraj Kumar — Founder & Visionary"
              className="w-24 h-24 mx-auto rounded-full object-cover mb-4 ring-2 ring-[#2874A6]/10 ring-offset-2 ring-offset-white transition group-hover:ring-[#2874A6]/30"
            />
            <h3 className="font-semibold text-lg text-gray-900">G.Neeraj Kumar</h3>
            <p className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-600 border border-rose-100">
              Founder & Visionary
            </p>
          </div>

          {/* Card 2 */}
          <div className="group bg-white rounded-2xl border border-rose-100 shadow-sm p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lg">
            <img
              src="/team2.jpg"
              alt="Maya Lee — Lead Designer"
              className="w-24 h-24 mx-auto rounded-full object-cover mb-4 ring-2 ring-[#2874A6]/10 ring-offset-2 ring-offset-white transition group-hover:ring-[#2874A6]/30"
            />
            <h3 className="font-semibold text-lg text-gray-900">Maya Lee</h3>
            <p className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-600 border border-rose-100">
              Lead Designer
            </p>
          </div>

          {/* Card 3 */}
          <div className="group bg-white rounded-2xl border border-rose-100 shadow-sm p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lg">
            <img
              src="/team3.jpg"
              alt="Daniel Smith — Head of Development"
              className="w-24 h-24 mx-auto rounded-full object-cover mb-4 ring-2 ring-[#2874A6]/10 ring-offset-2 ring-offset-white transition group-hover:ring-[#2874A6]/30"
            />
            <h3 className="font-semibold text-lg text-gray-900">Daniel Smith</h3>
            <p className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-600 border border-rose-100">
              Head of Development
            </p>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-[#2874A6] mb-6">Our Vision & Mission</h2>

          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#2874A6]/10 text-[#2874A6]">
                <FaLightbulb />
              </span>
              <p className="text-gray-700">
                <strong className="text-gray-900">Vision:</strong> To create a global skill-sharing network where knowledge is free and accessible to all.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#2874A6]/10 text-[#2874A6]">
                <FaFlagCheckered />
              </span>
              <p className="text-gray-700">
                <strong className="text-gray-900">Mission:</strong> To connect learners and teachers from all walks of life, fostering a culture of collaboration,
                curiosity, and mutual growth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;