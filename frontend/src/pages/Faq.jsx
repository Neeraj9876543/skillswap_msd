import React, { useState } from "react";
import { FaPlus, FaMinus, FaSearch, FaQuestionCircle, FaEnvelope } from "react-icons/fa";

const faqs = [
  {
    id: "what-is-skillswap",
    q: "What is SkillSwap?",
    a: (
      <p className="text-gray-700">
        SkillSwap is a platform that allows people to trade skills with others, helping you learn something new while sharing what you know.
      </p>
    ),
  },
  {
    id: "create-account",
    q: "How do I create an account?",
    a: (
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>
          Click on the <strong>Sign Up</strong> button in the top right corner.
        </li>
        <li>Fill in your name, email, and password.</li>
        <li>Confirm your email address.</li>
        <li>Start exploring skills!</li>
      </ul>
    ),
  },
  {
    id: "what-skills",
    q: "What skills can I swap?",
    a: (
      <>
        <p className="text-gray-700 mb-2">You can swap any skill! Here are some examples:</p>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Cooking & Baking</li>
          <li>Photography & Videography</li>
          <li>Programming & Web Development</li>
          <li>Music Lessons</li>
          <li>Language Exchange</li>
        </ul>
      </>
    ),
  },
  {
    id: "is-it-free",
    q: "Is SkillSwap free?",
    a: (
      <p className="text-gray-700">
        Yes. Skill swapping itself is free. Any optional costs (like materials or travel) are agreed upon between members.
      </p>
    ),
  },
  {
    id: "contact-members",
    q: "How do I contact another member?",
    a: (
      <p className="text-gray-700">
        Once you find a match, reach out using the contact method provided on their profile. We recommend keeping communications on-platform when possible and avoiding sharing sensitive info early on.
      </p>
    ),
  },
  {
    id: "multiple-skills",
    q: "Can I offer and learn more than one skill?",
    a: (
      <p className="text-gray-700">
        Absolutely. You can list several skills you can teach and multiple you want to learn—mix and match as you go.
      </p>
    ),
  },
  {
    id: "scheduling",
    q: "How do we schedule a session?",
    a: (
      <p className="text-gray-700">
        Pick a time and format that works for both of you—online or in person. Be clear about expectations (duration, goals, and any materials) before the session.
      </p>
    ),
  },
  {
    id: "expertise",
    q: "Do I need to be an expert to teach?",
    a: (
      <p className="text-gray-700">
        Not at all. If you have practical experience and can explain things clearly, you can help someone get started or improve.
      </p>
    ),
  },
  {
    id: "safety",
    q: "Any safety tips for meeting up?",
    a: (
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>Meet in a public place or start with an online session.</li>
        <li>Share only the information you’re comfortable with.</li>
        <li>Tell a friend where you’re going if meeting in person.</li>
        <li>Report any suspicious behavior to our team.</li>
      </ul>
    ),
  },
  {
    id: "edit-delete",
    q: "How do I update my profile or delete my account?",
    a: (
      <p className="text-gray-700">
        Visit your account settings to edit your profile or request account deletion. If you need help, email{" "}
        <a href="mailto:contact@skillswap.com" className="text-indigo-600 hover:text-indigo-700 underline">
          contact@skillswap.com
        </a>.
      </p>
    ),
  },
];

const FAQ = () => {
  const [query, setQuery] = useState("");
  const [openIds, setOpenIds] = useState(new Set());

  const filtered = faqs.filter((f) =>
    f.q.toLowerCase().includes(query.trim().toLowerCase())
  );

  const toggle = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setOpenIds(new Set(filtered.map((f) => f.id)));
  const collapseAll = () => setOpenIds(new Set());

  return (
    <section className="min-h-screen bg-gradient-to-b from-rose-50 via-rose-50 to-white w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-indigo-700 mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-700 mb-8">
          Everything you need to know about getting started and making the most of SkillSwap.
        </p>

        {/* Search + Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 py-2.5 text-[15px] text-gray-800 placeholder-gray-400 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={expandAll}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            >
              Expand all
            </button>
            <button
              onClick={collapseAll}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            >
              Collapse all
            </button>
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filtered.length === 0 && (
            <div className="rounded-2xl border border-rose-100 bg-white p-6 text-center text-gray-600">
              No results for “{query}”. Try a different keyword.
            </div>
          )}

          {filtered.map((item) => {
            const isOpen = openIds.has(item.id);
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-rose-100 shadow-sm p-4 sm:p-6"
              >
                <button
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${item.id}`}
                  id={`faq-q-${item.id}`}
                  onClick={() => toggle(item.id)}
                  className="w-full text-left flex items-start justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                      <FaQuestionCircle />
                    </span>
                    <span className="text-base sm:text-lg font-semibold text-gray-900">
                      {item.q}
                    </span>
                  </div>
                  <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                    {isOpen ? <FaMinus /> : <FaPlus />}
                  </span>
                </button>

                <div
                  id={`faq-a-${item.id}`}
                  role="region"
                  aria-labelledby={`faq-q-${item.id}`}
                  className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pt-2">{item.a}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 rounded-2xl border border-indigo-100 bg-indigo-50 p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-indigo-800">Still have questions?</h3>
            <p className="text-gray-700">
              We’re here to help. Reach out and we’ll get back to you ASAP.
            </p>
          </div>
          <a
            href="mailto:contact@skillswap.com"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
          >
            <FaEnvelope /> contact@skillswap.com
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;