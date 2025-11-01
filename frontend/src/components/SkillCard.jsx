import { motion } from "framer-motion";
import { FaPaperPlane, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { favoritesAPI, notificationsAPI } from "../utils/api";
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
function SkillCard({ c, onToggleFavorite, initialFavorite = false }) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  useEffect(() => {
    setIsFavorite(initialFavorite);
  }, [initialFavorite]);
  const handleRequest = async () => {
    const token = localStorage.getItem("skillSwapToken");
    if (!token) {
      Swal.fire({
        icon: "info",
        title: "Login required",
        text: "Please log in to send a request.",
      });
      return;
    }
    try {
      if (c.ownerId) {
        await notificationsAPI.create({
          receiverUserId: String(c.ownerId),
          type: "request",
          message: `New request for ${c.title}`,
          meta: { title: c.title, rate: c.rate, category: c.category, level: c.level },
        });
      }
      Swal.fire({
        title: "Request Sent!",
        text: `Your request to ${c.teacher} for "${c.title}" has been sent successfully.`,
        icon: "success",
        confirmButtonColor: "#f43f5e",
      });
    } catch (err) {
      console.error("Failed to create notification:", err);
      Swal.fire({ icon: "error", title: "Failed", text: "Could not send request. Please try again." });
    }
  };
  const toggleFavorite = async () => {
    const token = localStorage.getItem("skillSwapToken");
    if (!token) {
      Swal.fire({
        icon: "info",
        title: "Login required",
        text: "Please log in to add favorites.",
        confirmButtonText: "OK",
      });
      return;
    }
    const newFavState = !isFavorite;
    try {
      if (newFavState) {
        await favoritesAPI.addOrUpdate({
          externalId: String(c.id),
          title: c.title,
          category: c.category,
          level: c.level,
          desc: c.desc,
          teacher: c.teacher,
          avatar: c.avatar,
          rating: String(c.rating ?? ""),
          sessions: String(c.sessions ?? ""),
          rate: Number(c.rate ?? 0),
        });
      } else {
        await favoritesAPI.remove(String(c.id));
      }
      setIsFavorite(newFavState);
      if (onToggleFavorite) onToggleFavorite(c, newFavState);
      if (newFavState) {
        try {
          const rawUser = localStorage.getItem("skillSwapUser");
          const userObj = rawUser ? JSON.parse(rawUser) : null;
          const userName = userObj?.name || userObj?.username || "You";
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: `Liked by ${userName}`,
            showConfirmButton: false,
            timer: 1500,
          });
          if (c.ownerId) {
            try {
              await notificationsAPI.create({
                receiverUserId: String(c.ownerId),
                type: "like",
                message: `liked your skill \"${c.title}\"`,
                meta: { skillId: String(c.id), title: c.title },
              });
            } catch (_) {
            }
          }
        } catch (_) {
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: `Added to favorites`,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    } catch (err) {
      console.error("Favorite toggle failed:", err);
      Swal.fire({ icon: "error", title: "Failed", text: "Could not update favorites. Please try again." });
    }
  };
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ translateY: -6 }}
      className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">{c.category}</div>

          <div className="flex items-center gap-2">
            <button onClick={toggleFavorite} aria-label="Toggle favorite">
              <FaHeart
                size={18}
                className={`transition-colors duration-200 ${
                  isFavorite
                    ? "text-rose-500"
                    : "text-gray-300 hover:text-rose-400"
                }`}
              />
            </button>
            <div className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700 font-semibold">
              {c.level}
            </div>
          </div>
        </div>
        <h4 className="mt-3 font-semibold text-gray-900 text-lg">{c.title}</h4>
        <p className="text-sm text-gray-500 mt-2 line-clamp-3">{c.desc}</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={c.avatar && c.avatar.length > 0 ? c.avatar : `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(c.teacher || "User")}`}
            alt={c.teacher}
            className="w-10 h-10 rounded-full object-cover"
          />
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
              onClick={() => {
                const fallbackAvatar = `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(c.teacher || "User")}`;
                navigate("/messages", {
                  state: {
                    recipient: {
                      id: c.ownerId || null,
                      name: c.teacher,
                      avatar: c.avatar && c.avatar.length > 0 ? c.avatar : fallbackAvatar,
                    },
                  },
                });
              }}
              aria-label="Send message"
            >
              <FaPaperPlane size={18} />
            </button>
            <button
              onClick={handleRequest}
              className="px-3 py-1 bg-white border border-gray-100 rounded-md text-sm hover:bg-rose-50 text-rose-600"
            >
              Request
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
export default SkillCard;