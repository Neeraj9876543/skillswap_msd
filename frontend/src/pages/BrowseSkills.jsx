import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import SkillCard from "../components/SkillCard";
import apiCall from "../utils/api";
const cards = [
  {
    id:1,
    title: "Photography Basics",
    category: "Creative Arts",
    level: "Beginner",
    desc: "Learn the fundamentals of digital photography including composition, lighting, and camera settings.",
    teacher: "Sarah Chen",
    avatar: "https://i.pravatar.cc/40?img=32",
    rating: "4.9",
    sessions: "47",
    rate: 15,
  },
  {
    id:2,
    title: "React Development",
    category: "Technology",
    level: "Intermediate",
    desc: "Master modern React development with hooks, context, and best practices for building scalable apps.",
    teacher: "Alex Rodriguez",
    avatar: "https://i.pravatar.cc/40?img=12",
    rating: "4.8",
    sessions: "62",
    rate: 25,
  },
  {
    id:3,
    title: "Spanish Conversation",
    category: "Languages",
    level: "Beginner",
    desc: "Practice conversational Spanish with a native speaker. Focus on everyday situations and cultural context.",
    teacher: "Maria Santos",
    avatar: "https://i.pravatar.cc/40?img=15",
    rating: "4.95",
    sessions: "89",
    rate: 18,
  },
  {
    id:4,
    title: "Korean Cooking",
    category: "Cooking",
    level: "Intermediate",
    desc: "Learn to cook authentic Korean dishes including kimchi, bulgogi, and traditional side dishes.",
    teacher: "David Kim",
    avatar: "https://i.pravatar.cc/40?img=10",
    rating: "4.9",
    sessions: "34",
    rate: 20,
  },
  {
    id:5,
    title: "Guitar for Beginners",
    category: "Music",
    level: "Beginner",
    desc: "Learn basic guitar chords, strumming patterns, and play your first songs.",
    teacher: "Emma Thompson",
    avatar: "https://i.pravatar.cc/40?img=18",
    rating: "4.85",
    sessions: "78",
    rate: 22,
  },
  {
    id:6,
    title: "Digital Marketing Strategy",
    category: "Business",
    level: "Advanced",
    desc: "Comprehensive digital marketing training covering SEO, social media, content marketing, and analytics.",
    teacher: "Carlos Silva",
    avatar: "https://i.pravatar.cc/40?img=21",
    rating: "4.7",
    sessions: "29",
    rate: 30,
  },
  {
    id:7,
    title: " Advanced Photography",
    category: "Creative Arts",
    level: "Advanced",
    desc: "Master advanced techniques in portrait, landscape, and studio photography with professional equipment.",
    teacher: "Sarah Chen",
    avatar: "https://i.pravatar.cc/40?img=32",
    rating: "4.9",
    sessions: "47",
    rate: 28,
  },
  {
    id:8,
    title: "Node.js Backend Development",
    category: "Technology",
    level: "Intermediate",
    desc: "Build scalable backend applications with Node.js, Express, and database integration.",
    teacher: "Alex Rodriguez",
    avatar: "https://i.pravatar.cc/40?img=32",
    rating: "4.8",
    sessions: "62",
    rate: 26,
  },
  {
    id:9,
    title: "Advanced Spanish Grammar",
    category: "Languages",
    level: "Advanced",
    desc: "Perfect your Spanish grammar with complex tenses, subjunctive mood, and advanced sentence structures",
    teacher: "Maria Santos",
    avatar: "https://i.pravatar.cc/40?img=32",
    rating: "4.95",
    sessions: "89",
    rate: 24,
  },
  {
    id:10,
    title: "Professional Music Recording",
    category: "Music",
    level: "Advanced",
    desc: "Learn professional recording techniques, mixing, and music production in home studios.",
    teacher: "Emma Thompson",
    avatar: "https://i.pravatar.cc/40?img=32",
    rating: "4.85",
    sessions: "78",
    rate: 32,
  },
  {
    id:11,
    title: "Social Media Marketing",
    category: "Business",
    level: "Beginner",
    desc: "Create engaging content and grow your social media presence across different platforms.",
    teacher: "Carlos Silva",
    avatar: "https://i.pravatar.cc/40?img=32",
    rating: "4.7",
    sessions: "29",
    rate: 16,
  },
  {
    id:12,
    title: "Fusion Cooking Techniques",
    category: "Cooking",
    level: "Advanced",
    desc: "Explore creative fusion cooking combining Korean flavors with international cuisines.",
    teacher: "David Kim",
    avatar: "https://i.pravatar.cc/40?img=32",
    rating: "4.9",
    sessions: "34",
    rate: 25,
  },
];
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};
function SkillSwapPage() {
  const [query, setQuery] = useState("");
  const [openCat, setOpenCat] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [openLevel, setOpenLevel] = useState(false);
  const [selectedLevels, setSelectedLevels] = useState(new Set());
  const [dynamicCards, setDynamicCards] = useState([]);
  useEffect(() => {
    const fetchProfileSkills = async () => {
      try {
        const data = await apiCall("/skills");
        const mapped = (data?.skills || []).map((s) => ({
          id: s.id,
          ownerId: s.externalProfileId,
          title: s.title,
          category: s.category,
          level: s.level,
          desc: s.desc,
          teacher: s.teacher,
          avatar: s.avatar,
          rating: String(s.rating ?? "4.9"),
          sessions: String(s.sessions ?? "0"),
          rate: Number(s.rate ?? 0),
        }));
        setDynamicCards(mapped);
      } catch (err) {
        console.error("Failed to load public skills for BrowseSkills:", err);
        setDynamicCards([]);
      }
    };
    fetchProfileSkills();
  }, []);
  const allCards = useMemo(() => {
    const idx = cards.findIndex((c) => c.id === 12);
    if (idx >= 0) {
      return [...cards.slice(0, idx + 1), ...dynamicCards, ...cards.slice(idx + 1)];
    }
    return [...cards, ...dynamicCards];
  }, [dynamicCards]);
  const allCategories = useMemo(() => {
    const cats = Array.from(new Set(allCards.map((c) => c.category)));
    return ["All", ...cats];
  }, [allCards]);
  function toggleCategory(cat) {
    if (cat === "All") {
      setSelected(new Set());
      return;
    }
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }
  const allLevels = useMemo(() => {
    const levels = Array.from(new Set(allCards.map((c) => c.level)));
    return ["All", ...levels];
  }, [allCards]);
  function toggleLevels(level) {
    if (level === "All") {
      setSelectedLevels(new Set());
      return;
    }
    setSelectedLevels((prev) => {
      const next = new Set(prev);
      if (next.has(level)) next.delete(level);
      else next.add(level);
      return next;
    });
  }
  const filtered = useMemo(() => {
    return allCards.filter((c) => {
      const matchesQuery =
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.desc.toLowerCase().includes(query.toLowerCase());

      const matchesCategory = selected.size === 0 || selected.has(c.category);
      const matchesLevel = selectedLevels.size === 0 || selectedLevels.has(c.level);

      return matchesQuery && matchesCategory && matchesLevel;
    });
  }, [query, selected, selectedLevels, allCards]);
  return (
    <div className="min-h-screen bg-gradient-to-r from-rose-50 to-white text-gray-800">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-md -mt-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start">
            <div className="flex-1">
              <label htmlFor="search" className="sr-only">Search skills</label>
              <div className="relative">
                <input
                  id="search"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search skills..."
                  className="block w-full rounded-xl border border-gray-200 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setOpenCat((s) => !s)}
                  className="inline-flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-xl bg-white shadow-sm"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray-500">
                    <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 5h18M6 12h12M10 19h4" />
                  </svg>
                  <span className="text-sm">Categories</span>
                </button>
                {openCat && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg z-30 p-3">
                    <div className="text-xs text-gray-500 mb-2">Filter by category</div>
                    <div className="flex flex-col gap-2">
                      {allCategories.map((cat) => (
                        <label key={cat} className="inline-flex items-center gap-2 cursor-pointer text-sm">
                          <input
                            type="checkbox"
                            checked={cat === 'All' ? selected.size === 0 : selected.has(cat)}
                            onChange={() => toggleCategory(cat)}
                          />
                          <span className="capitalize">{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => setOpenLevel((s) => !s)}
                  className="inline-flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-xl bg-white shadow-sm"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray-500">
                    <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 5h18M6 12h12M10 19h4" />
                  </svg>
                  <span className="text-sm">Skill Level</span>
                </button>
                {openLevel && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg z-30 p-3">
                    <div className="text-xs text-gray-500 mb-2">Filter by levels</div>
                    <div className="flex flex-col gap-2">
                      {allLevels.map((level) => (
                        <label key={level} className="inline-flex items-center gap-2 cursor-pointer text-sm">
                          <input
                            type="checkbox"
                            checked={level === 'All' ? selectedLevels.size === 0 : selectedLevels.has(level)}
                            onChange={() => toggleLevels(level)}
                          />
                          <span className="capitalize">{level}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Browse Skills</h2>
              <p className="text-sm text-gray-500 mt-1">{filtered.length} skills available</p>
            </div>
          </div>
          <motion.div
            className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filtered.map((c, idx) => (
              <SkillCard key={idx} c={c} />
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
export default SkillSwapPage;
