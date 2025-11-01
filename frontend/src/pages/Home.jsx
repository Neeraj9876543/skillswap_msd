import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { CountUp } from "./CountUp";
import { authAPI } from "../utils/api";
import axios from "axios";
const stats = [
  { icon: "👥", value: 2500, suffix: "+", label: "Active Members" },
  { icon: "📚", value: 150, suffix: "+", label: "Skills Available" },
  { icon: "✅", value: 10000, suffix: "+", label: "Sessions Completed" },
];
const cards = [
  {
    title: "Photography Basics",
    category: "Creative Arts",
    level: "Beginner",
    desc: "Learn the fundamentals of digital photography including composition, lighting, and camera settings.",
    teacher: "Sarah Chen",
    rating: "4.9",
    sessions: "47",
    rate: 15,
  },
  {
    title: "React Development",
    category: "Technology",
    level: "Intermediate",
    desc: "Master modern React development with hooks, context, and best practices for building scalable apps.",
    teacher: "Alex Rodriguez",
    rating: "4.8",
    sessions: "62",
    rate: 25,
  },
  {
    title: "Spanish Conversation",
    category: "Languages",
    level: "Beginner",
    desc: "Practice conversational Spanish with a native speaker. Focus on everyday situations and cultural context.",
    teacher: "Maria Santos",
    rating: "4.95",
    sessions: "89",
    rate: 18,
  },
  {
    title: "Korean Cooking",
    category: "Cooking",
    level: "Intermediate",
    desc: "Learn to cook authentic Korean dishes including kimchi, bulgogi, and traditional side dishes.",
    teacher: "David Kim",
    rating: "4.9",
    sessions: "34",
    rate: 20,
  },
  {
    title: "Guitar for Beginners",
    category: "Music",
    level: "Beginner",
    desc: "Learn basic guitar chords, strumming patterns, and play your first songs.",
    teacher: "Emma Thompson",
    rating: "4.85",
    sessions: "78",
    rate: 22,
  },
  {
    title: "Digital Marketing Strategy",
    category: "Business",
    level: "Advanced",
    desc: "Comprehensive digital marketing training covering SEO, social media, content marketing, and analytics.",
    teacher: "Carlos Silva",
    rating: "4.7",
    sessions: "29",
    rate: 30,
  },
];
const containerVariants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.08, when: "beforeChildren" },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.995 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
};
function Home() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [requestSent, setRequestSent] = useState({}); // track per-card request state

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await authAPI.getProfile();
        setIsAuthenticated(!!userData);
      } catch (err) {
        console.error('Auth check failed:', err);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleShareSkillsClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      alert('Please login to share your skills');
      navigate('/login');
    }
  };

  const handleStartLearningClick = async (e) => {
    e.preventDefault();
    
    // Wait for the authentication check to complete
    if (loading) {
      // If still loading, wait a bit and try again
      await new Promise(resolve => setTimeout(resolve, 300));
      if (loading) {
        console.log('Still loading auth state...');
        return;
      }
    }
    
    // Now check authentication
    if (isAuthenticated) {
      navigate('/browse');
    } else {
      navigate('/signup');
    }
  };

  const handleRequestClick = (idx) => {
    setRequestSent((prev) => ({ ...prev, [idx]: true }));
    setTimeout(() => {
      setRequestSent((prev) => ({ ...prev, [idx]: false }));
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-rose-50 to-white w-full">
      <main className="w-full py-16 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start w-full">
          <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="lg:col-span-7 w-full"
          >
            <motion.h1
              variants={itemVariants}
              className="text-7xl md:text-5xl font-extrabold tracking-tight text-gray-900"
            >
              Learn, Teach, and{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-pink-500 to-violet-600">
                Grow Together
              </span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="mt-4 text-gray-600 max-w-4xl"
            >
              SkillSwap is a community-driven platform where people exchange
              knowledge and skills without money getting in the way. Earn
              credits by sharing your expertise, then spend them to learn from
              others.
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-wrap gap-7"
            >
              <button
                onClick={handleStartLearningClick}
                className="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-full shadow-lg font-semibold"
              >
                Start Learning Today
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  ></path>
                </svg>
              </button>
              <a
                href="/profile"
                onClick={handleShareSkillsClick}
                className="inline-flex items-center gap-3 border border-gray-300 hover:border-rose-400 text-gray-800 px-5 py-3 rounded-full font-semibold"
              >
                Share Your Skills
              </a>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="mt-10 grid grid-cols-3 gap-4"
            >
              {stats.map((s, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="bg-white rounded-xl p-5 shadow-sm flex flex-col items-center"
                >
                  <div className="text-2xl">{s.icon}</div>
                  <div className="text-xl font-bold mt-2 text-black">
                    <CountUp
                      value={s.value}
                      suffix={s.suffix}
                      duration={2}
                      colorScheme="primary"
                      customColor="#000"
                    />
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{s.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
          <div className="lg:col-span-5 flex justify-center items-center">
            <motion.img
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              src="side.jpg"
              alt="Learning community"
              className="rounded-2xl shadow-lg w-full object-cover"
            />
          </div>
        </div>
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="mt-12 w-full"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Popular Skills
          </h3>
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {cards.map((c, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">{c.category}</div>
                    <div className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700 font-semibold">
                      {c.level}
                    </div>
                  </div>

                  <h4 className="mt-3 font-semibold text-gray-900">
                    {c.title}
                  </h4>
                  <p className="text-sm text-gray-500 mt-2">{c.desc}</p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
                      {c.teacher
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{c.teacher}</div>
                      <div className="text-xs text-gray-500">
                        ★ {c.rating} · {c.sessions} sessions
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-sm font-bold text-amber-600">
                      {c.rate} credits/hr
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="text-gray-400 hover:text-gray-600"
                        onClick={() => navigate("/messages")}
                      >
                        <FaPaperPlane size={18} />
                      </button>
                      <button
                        onClick={() => handleRequestClick(idx)}
                        className={`px-3 py-1 rounded-md text-sm border ${
                          requestSent[idx]
                            ? "bg-green-50 border-green-200 text-green-600"
                            : "bg-white border-gray-100 text-rose-600 hover:bg-rose-50"
                        }`}
                      >
                        {requestSent[idx] ? "Request Sent" : "Request"}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      </main>
    </div>
  );
}
export default Home;
