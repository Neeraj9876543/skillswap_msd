import React, { useState } from "react";
import { FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaCheckCircle } from "react-icons/fa";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    category: "General",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = "Enter a valid email.";
    if (!form.subject.trim()) err.subject = "Please add a subject.";
    if (form.message.trim().length < 10) err.message = "Message should be at least 10 characters.";
    return err;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setSending(true);
    setSent(false);

    try {
      const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors?.[0]?.msg || 'Failed to send message');
      }

      setSent(true);
      setForm({ name: "", email: "", subject: "", category: "General", message: "" });
    } catch (err) {
      console.error('Error submitting contact form:', err);
      setErrors({ submit: err.message || 'Failed to send message. Please try again.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-rose-50 via-rose-50 to-white w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-indigo-700 mb-4">
          Contact Us
        </h1>
        <p className="text-gray-700 mb-10">
          Questions, feedback, or partnership ideas? We’d love to hear from you.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-rose-100 shadow-sm p-6 sm:p-8">
            {sent && (
              <div
                className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700"
                role="status"
                aria-live="polite"
              >
                <FaCheckCircle /> Your message has been sent. We’ll get back to you soon.
              </div>
            )}

            <form onSubmit={onSubmit} noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-1">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    placeholder="Your full name"
                    className={`w-full rounded-xl border bg-white px-4 py-2.5 text-[15px] text-gray-800 placeholder-gray-400 shadow-sm transition
                      ${errors.name
                        ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                        : "border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"}`}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1 text-sm text-rose-600">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    placeholder="you@example.com"
                    className={`w-full rounded-xl border bg-white px-4 py-2.5 text-[15px] text-gray-800 placeholder-gray-400 shadow-sm transition
                      ${errors.email
                        ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                        : "border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"}`}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1 text-sm text-rose-600">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Subject + Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-800 mb-1">
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={form.subject}
                    onChange={handleChange}
                    aria-invalid={!!errors.subject}
                    aria-describedby={errors.subject ? "subject-error" : undefined}
                    placeholder="How can we help?"
                    className={`w-full rounded-xl border bg-white px-4 py-2.5 text-[15px] text-gray-800 placeholder-gray-400 shadow-sm transition
                      ${errors.subject
                        ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                        : "border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"}`}
                  />
                  {errors.subject && (
                    <p id="subject-error" className="mt-1 text-sm text-rose-600">
                      {errors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-800 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-[15px] text-gray-800 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                  >
                    <option>General</option>
                    <option>Support</option>
                    <option>Feedback</option>
                    <option>Partnership</option>
                    <option>Bug Report</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="mt-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-800 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  placeholder="Write your message..."
                  rows={6}
                  className={`w-full rounded-2xl border bg-white px-4 py-3 text-[15px] text-gray-800 placeholder-gray-400 shadow-sm transition resize-y
                    ${errors.message
                      ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                      : "border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"}`}
                />
                {errors.message && (
                  <p id="message-error" className="mt-1 text-sm text-rose-600">
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <div className="mt-6 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
                >
                  {sending ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane /> Send message
                    </>
                  )}
                </button>
                <a
                  href="mailto:contact@skillswap.com"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                >
                  <FaEnvelope /> Email us directly
                </a>
              </div>
            </form>
          </div>

          {/* Contact info */}
          <aside className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Get in touch</h2>
            <p className="text-gray-700 mb-5">
              We usually reply within 24–48 hours.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                  <FaEnvelope />
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <a
                    href="mailto:contact@skillswap.com"
                    className="text-indigo-600 hover:text-indigo-700 underline"
                  >
                    contact@skillswap.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                  <FaMapMarkerAlt />
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-900">Location</p>
                  <p className="text-gray-700">Remote-first • Worldwide</p>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
              <p className="text-sm text-indigo-800">
                Tip: For common questions, check our{" "}
                <a href="/faq" className="font-medium underline">
                  FAQ
                </a>{" "}
                first.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Contact;