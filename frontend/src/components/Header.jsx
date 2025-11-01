// src/components/Header.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPaperPlane, FaHeart, FaBell } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import apiCall, { authAPI, favoritesAPI, notificationsAPI } from "../utils/api";
import NotificationsDropdown from "./NotificationsDropdown";
const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifLoadingById, setNotifLoadingById] = useState({});
  const [unreadMsgCount, setUnreadMsgCount] = useState(0);
  const tools = [
    { name: "Home", path: "/" },
    { name: "Browse Skills", path: "/browse" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Profile", path: "/profile" },
  ];
  useEffect(() => {
    const token = localStorage.getItem("skillSwapToken");
    if (!token) {
      setUser(null);
      return;
    }
    const fetchUserData = async () => {
      try {
        const userData = await authAPI.getProfile();
        let imageUrl = "";
        try {
          const prof = await apiCall("/profile/me");
          if (prof?.image) {
            imageUrl =
              typeof prof.image === "string" && prof.image.startsWith("/uploads/")
                ? `${import.meta.env.VITE_API_URL}${prof.image}`
                : prof.image;
          }
        } catch (_) {}
        setUser({ ...userData, image: imageUrl });
        try {
          const notif = await notificationsAPI.list();
          const all = Array.isArray(notif?.notifications) ? notif.notifications : [];
          const msgUnread = all.filter((n) => n.type === "message" && !n.read).length;
          setUnreadMsgCount(msgUnread);
          const filtered = all.filter((n) => n.type !== "message");
          setNotifications(filtered);
          const unread = filtered.filter((n) => !n.read).length;
          setUnreadCount(unread);
        } catch (_) {}
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
      }
    };
    fetchUserData();
  }, []);
  useEffect(() => {
    let timerId;
    const token = localStorage.getItem("skillSwapToken");
    if (token) {
      const poll = async () => {
        try {
          const resp = await notificationsAPI.list();
          const all = Array.isArray(resp?.notifications) ? resp.notifications : [];
          const msgUnread = all.filter((n) => n.type === "message" && !n.read).length;
          setUnreadMsgCount(msgUnread);
          const filtered = all.filter((n) => n.type !== "message");
          setNotifications(filtered);
          setUnreadCount(filtered.filter((n) => !n.read).length);
        } catch (_) {}
      };
      poll();
      timerId = setInterval(poll, 10000);
    }
    return () => timerId && clearInterval(timerId);
  }, []);
  const refreshNotifications = useCallback(async () => {
    try {
      const resp = await notificationsAPI.list();
      const all = Array.isArray(resp?.notifications) ? resp.notifications : [];
      const msgUnread = all.filter((n) => n.type === "message" && !n.read).length;
      setUnreadMsgCount(msgUnread);
      const filtered = all.filter((n) => n.type !== "message");
      setNotifications(filtered);
      setUnreadCount(filtered.filter((n) => !n.read).length);
    } catch (e) {
      console.error("Failed to load notifications", e);
    }
  }, []);
  useEffect(() => {
    const handler = () => {
      refreshNotifications();
    };
    window.addEventListener("notifications:update", handler);
    return () => window.removeEventListener("notifications:update", handler);
  }, [refreshNotifications]);
  const handleToggleNotif = async () => {
    const next = !notifOpen;
    setNotifOpen(next);
    if (next && notifications.length === 0) {
      await refreshNotifications();
    }
  };
  const handleAcceptNotification = async (n) => {
    const id = n._id;
    setNotifLoadingById((m) => ({ ...m, [id]: true }));
    try {
      await notificationsAPI.accept(id);
      await refreshNotifications();
    } catch (e) {
      console.error("Accept failed", e);
    } finally {
      setNotifLoadingById((m) => ({ ...m, [id]: false }));
    }
  };
  const handleMarkRead = async (n) => {
    try {
      await notificationsAPI.markRead(n._id);
      await refreshNotifications();
    } catch (e) {
      console.error("Mark read failed", e);
    }
  };
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.trim()) {
      const results = tools.filter((tool) =>
        tool.name.toLowerCase().includes(value.toLowerCase())
      );
      setFiltered(results);
    } else {
      setFiltered([]);
    }
  };
  const handleSelect = (path) => {
    setSearch("");
    setFiltered([]);
    navigate(path);
  };
  const handleLogout = () => {
    localStorage.removeItem("skillSwapToken");
    localStorage.removeItem("skillSwapUser");
    setUser(null);
    setDropdownOpen(false);
    navigate("/login");
  };
  return (
    <header className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between relative">
        <motion.div
          className="flex items-center gap-3 cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          <img
            src="/logo.png"
            alt="SkillSwap Logo"
            className="w-10 h-10 rounded-md shadow object-cover"
          />
          <Link to="/" className="font-semibold text-gray-800">
            SkillSwap
          </Link>
        </motion.div>
        <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-700 hover:text-indigo-600 transition">Home</Link>
          <Link to="/browse" className="text-gray-700 hover:text-indigo-600 transition">Browse Skills</Link>
          <Link to="/favorites" className="text-gray-700 hover:text-red-500 transition">❤️</Link>
        </nav>
        <nav className="flex md:hidden items-center gap-4">
          <Link to="/" className="text-gray-700 text-sm hover:text-indigo-600 transition">Home</Link>
          <Link to="/browse" className="text-gray-700 text-sm hover:text-indigo-600 transition">Browse</Link>
          <Link to="/favorites" className="text-gray-700 text-sm hover:text-red-500 transition">Favs</Link>
        </nav>
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block w-48">
            <AnimatePresence>
              {filtered.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute top-full left-0 right-0 bg-white shadow-md rounded border mt-1 z-50"
                >
                  {filtered.map((tool) => (
                    <li
                      key={tool.path}
                      onClick={() => handleSelect(tool.path)}
                      className="px-4 py-2 text-sm cursor-pointer hover:bg-indigo-100 transition"
                    >
                      {tool.name}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
          {!user ? (
            <>
              <Link to="/login" className="text-indigo-600 font-medium hover:underline text-sm">Login</Link>
              <Link to="/signup" className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm">Sign Up</Link>
            </>
          ) : (
            <div className="relative flex items-center gap-3">
              <Link
                to="/messages"
                title="Messages"
                className="inline-flex items-center justify-center w-9 h-9 rounded-full text-gray-600 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition relative"
                aria-label="Messages"
              >
                <FaPaperPlane size={20} />
                {unreadMsgCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {unreadMsgCount}
                  </span>
                )}
              </Link>
              <div className="relative">
                <button
                  title="Notifications"
                  onClick={handleToggleNotif}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full text-gray-600 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 relative transition"
                  aria-label="Notifications"
                >
                  <FaBell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <NotificationsDropdown
                  isOpen={notifOpen}
                  onClose={() => setNotifOpen(false)}
                  notifications={notifications}
                  onAccept={handleAcceptNotification}
                  onMarkRead={handleMarkRead}
                  loadingById={notifLoadingById}
                />
              </div>
              <div onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-lg transition">
                <img
                  src={user.image && user.image.length > 0
                    ? user.image
                    : `https://api.dicebear.com/6.x/initials/svg?seed=${user.username}&background=%23f3f4f6`}
                  alt="User"
                  className="w-8 h-8 rounded-full object-cover border"
                />
                <span className="text-gray-800 font-medium text-sm">{user.username}</span>
              </div>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg z-50"
                  >
                    <div className="px-4 py-3 text-sm text-gray-700 border-b">
                      👋 Hello, <strong>{user.username}</strong>
                      <p className="text-xs text-gray-500">Welcome back to SkillSwap!</p>
                    </div>
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 text-sm" onClick={() => setDropdownOpen(false)}>👤 View Profile</Link>
                    <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100 text-sm" onClick={() => setDropdownOpen(false)}>📊 Dashboard</Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm">🚪 Logout</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
export default Header;